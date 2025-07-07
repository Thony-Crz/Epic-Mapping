using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OAuthAuthenticationService : IAuthenticationService
    {
        public Task<AuthResult> AuthenticateWithOAuthAsync(string provider, string code)
        {
            // Implementation for OAuth authentication goes here
            throw new NotImplementedException("OAuth authentication is not implemented yet.");
        }
    }
}
