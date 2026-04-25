namespace WebApi.Common.Responses
{
    public static class ApiResponseFactory
    {
        public static ApiResponse<T> Success<T>(T data, string message = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message,
                Errors = []
            };
        }

        public static ApiResponse<T> Failure<T>(string message, List<string> errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Data = default,
                Message = message,
                Errors = errors ?? []
            };
        }
    }
}
