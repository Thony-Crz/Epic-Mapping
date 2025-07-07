using Application.DTOs.GenerateToken;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.UseCases.Token
{
    public record GenerateTokenCommand(string Username, string Password)
        : IRequest<GenerateTokenResult>;

    public class GenerateTokenHandler(IConfiguration config)
    : IRequestHandler<GenerateTokenCommand, GenerateTokenResult>
    {
        // TODO : les dépendances devraient aller dans la couche Infrastructure, mais pour simplifier l'exemple, on les met ici.
        public Task<GenerateTokenResult> Handle(GenerateTokenCommand request, CancellationToken cancellationToken)
        {
            // Auth simplifiée
            if (request.Username != "admin" || request.Password != "password")
                throw new UnauthorizedAccessException("Invalid credentials");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, request.Username)
            };

            if (config == null || string.IsNullOrEmpty(config["Jwt:Key"]) || string.IsNullOrEmpty(config["Jwt:Issuer"]))
                throw new InvalidOperationException("JWT configuration is missing or incomplete.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(1);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Issuer"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Task.FromResult(new GenerateTokenResult(tokenString, expires, request.Username));
        }

    }
}
