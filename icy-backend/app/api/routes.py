from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.service import auth
from app.schema import schemas
from app.Database.Database import get_user_collection 
from app.Database.models import User  # Import User from models, not auth
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

@app.post("/auth/register", response_model=schemas.Token)
async def register_user(user_data: schemas.UserCreateManual):
    users_collection = get_user_collection()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and create user
    password_hash = User.hash_password(user_data.password)
    new_user = {
        "email": user_data.email,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "password_hash": password_hash,
        "auth_method": "manual"
    }
    
    result = await users_collection.insert_one(new_user)
    user = await users_collection.find_one({"_id": result.inserted_id})
    
    # Create access token
    access_token = auth.create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "auth_method": user["auth_method"]
        }
    }


@app.post("/auth/login", response_model=schemas.Token)
async def login_user(login_data: schemas.UserLogin):
    users_collection = get_user_collection()
    
    # Find user
    user = await users_collection.find_one({"email": login_data.email})
    if not user or user.get("auth_method") != "manual":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Convert ObjectId to string for Pydantic model
    user_copy = dict(user)
    if "_id" in user_copy and user_copy["_id"]:
        user_copy["_id"] = str(user_copy["_id"])
    
    # Verify password
    user_obj = User(**user_copy)
    if not user_obj.verify_password(login_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = auth.create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "auth_method": user["auth_method"]
        }
    }

@app.post("/auth/google", response_model=schemas.Token)
async def google_auth(request: schemas.GoogleAuthRequest):
    try:
        # Verify Google token
        user_info = await auth.verify_google_token(request.access_token)
        
        users_collection = get_user_collection()
        
        # Check if user exists by google_id or email
        existing_user = await users_collection.find_one({
            "$or": [
                {"google_id": user_info["sub"]},
                {"email": user_info["email"]}
            ]
        })
        
        if existing_user:
            # Update existing user with Google info if needed
            if not existing_user.get("google_id"):
                await users_collection.update_one(
                    {"_id": existing_user["_id"]},
                    {"$set": {
                        "google_id": user_info["sub"],
                        "auth_method": "google",
                        "profile_picture": user_info.get("picture")
                    }}
                )
                user = await users_collection.find_one({"_id": existing_user["_id"]})
            else:
                user = existing_user
        else:
            # Create new user
            new_user = {
                "google_id": user_info["sub"],
                "email": user_info["email"],
                "first_name": user_info.get("given_name", ""),
                "last_name": user_info.get("family_name", ""),
                "profile_picture": user_info.get("picture"),
                "auth_method": "google"
            }
            result = await users_collection.insert_one(new_user)
            user = await users_collection.find_one({"_id": result.inserted_id})
        
        # Create access token
        access_token = auth.create_access_token(data={"sub": user["email"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "profile_picture": user.get("profile_picture"),
                "auth_method": user["auth_method"]
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
        
        
@app.get("/users/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: dict = Depends(auth.get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "first_name": current_user["first_name"],
        "last_name": current_user["last_name"],
        "profile_picture": current_user.get("profile_picture"),
        "auth_method": current_user["auth_method"],
        "created_at": current_user["created_at"]
    }

@app.get("/")
async def root():
    return {"message": "Dual Authentication API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
