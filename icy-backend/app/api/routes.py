from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.service import auth
from app.schema import schemas
from app.Database.Database import get_user_collection 
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Google Auth API", version="1.0.0")

# CORS configuration
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/google")
async def google_auth(request: schemas.GoogleAuthRequest):
    """Authenticate with Google token"""
    print(f"Received credential: {request.access_token[:50]}...")  # Log first 50 chars for security
    try:
        # Verify Google token (now handling JWT credential)
        user_info = await auth.verify_google_token(request.access_token)
        print(f"Google user info: {user_info}")
        
        # Check if user exists
        users_collection = get_user_collection()
        existing_user = await users_collection.find_one({"google_id": user_info["sub"]})
        
        if existing_user:
            user_data = existing_user
        else:
            # Create new user
            new_user = {
                "google_id": user_info["sub"],
                "email": user_info["email"],
                "first_name": user_info.get("given_name", ""),
                "last_name": user_info.get("family_name", ""),
                "profile_picture": user_info.get("picture"),
            }
            result = await users_collection.insert_one(new_user)
            user_data = await users_collection.find_one({"_id": result.inserted_id})
        
        # Create access token
        access_token = auth.create_access_token(
            data={"sub": user_data["email"]}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user_data["_id"]),
                "email": user_data["email"],
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "profile_picture": user_data.get("profile_picture"),
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(auth.get_current_user)):
    """Get current user information"""
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "first_name": current_user["first_name"],
        "last_name": current_user["last_name"],
        "profile_picture": current_user.get("profile_picture"),
    }

@app.get("/")
async def root():
    return {"message": "Google Auth API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)