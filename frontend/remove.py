import os
import shutil

backend_build_path = os.path.join("..", "backend", "core", "build")

if os.path.exists(backend_build_path):
    shutil.rmtree(backend_build_path)

if os.path.exists("dist"):
    shutil.move("dist", backend_build_path)
else:
    print("You need first to build the frontend.")
