using Microsoft.Graph;
using Azure.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Identity.Client;

namespace SobotySTechnikou.Services
{
    public class EmailSender : IEmailSender
    {
        readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config=config;
        }

        public async Task SendEmailAsync(string email, string subject, string text)
        {
            var message = new Message
            {
                Subject = subject,
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = text
                },
                ToRecipients = new List<Recipient>()
                {
                    new Recipient { EmailAddress = new EmailAddress { Address = email } }
                }
            };

            string[] scopes = new string[] { "https://graph.microsoft.com/.default" };

            var options = new TokenCredentialOptions
            {
                AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
            };

            var authProvider = new ClientSecretCredential(
                _config["EmailSender:TenantId"],
                _config["EmailSender:ClientId"],
                _config["EmailSender:ClientSecret"],
                options);
            //var authProvider = new ClientCredentialProvider(ConfidentialClientApplication);
            var graphClient = new GraphServiceClient(authProvider);
            await graphClient.Users[_config["EmailSender:UserId"]]
                .SendMail(message, false)
                .Request()
                .PostAsync();
        }
    }
}
