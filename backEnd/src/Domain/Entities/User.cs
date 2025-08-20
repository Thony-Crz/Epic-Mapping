namespace Domain.Entities
{
    public class User
    {
        private string providerUserId;
        private string email;
        private string name;

        public User(string providerUserId, string email, string name)
        {
            this.providerUserId = providerUserId;
            this.email = email;
            this.name = name;
        }

        public string Email { get; set; }
        public string Name { get; set; }
    }
}
