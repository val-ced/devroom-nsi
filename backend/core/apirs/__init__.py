from django.http import JsonResponse

class JsonResponseError(JsonResponse):
    def __init__(self, error_message: str, *args, **kwargs) -> None:
        
        error_message = {"error": error_message}

        super().__init__(error_message, *args, **kwargs)

