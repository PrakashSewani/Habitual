namespace Application.Abstractions.Authentication
{
    public interface ITokenService
    {
        string GenerateAccessToken(Guid userId, string email);
        string GenerateRefreshToken();
    }
}
