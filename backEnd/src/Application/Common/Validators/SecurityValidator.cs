using System.Text.RegularExpressions;

namespace Application.Common.Validators;

public static class SecurityValidator
{
    private static readonly Regex MaliciousPatternRegex = new(
        string.Join("|", new[]
        {
            @"<script.*?>.*?</script>",  // XSS script tags
            @"javascript:",              // javascript: protocol
            @"on\w+\s*=",               // HTML event handlers (onclick, onerror, etc.)
            @"drop\s+table",            // SQL injection
            @"union\s+select",          // SQL injection
            @"insert\s+into",           // SQL injection
            @"delete\s+from",           // SQL injection
            @"\$\{.*?\}",              // Template injection
            @"\.\.\/",                  // Path traversal
            @"%3c.*?%3e",              // URL encoded HTML tags
            @"\x00"                     // Null bytes
        }),
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    /// <summary>
    /// Vérifie si une entrée utilisateur est sécurisée (ne contient pas de patterns malveillants)
    /// </summary>
    /// <param name="input">L'entrée utilisateur à valider</param>
    /// <returns>True si sécurisée ou null/empty, False si des patterns suspects sont détectés</returns>
    public static bool IsSecure(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return true; // Entrée vide considérée comme sûre

        return !MaliciousPatternRegex.IsMatch(input);
    }

    /// <summary>
    /// Valide la sécurité d'une entrée utilisateur et lève une exception si suspecte
    /// </summary>
    /// <param name="input">L'entrée utilisateur à valider</param>
    /// <param name="paramName">Le nom du paramètre pour l'exception</param>
    /// <exception cref="ArgumentException">Si l'entrée contient des patterns suspects</exception>
    public static void Validate(string? input, string paramName)
    {
        if (!IsSecure(input))
        {
            throw new ArgumentException("Input contains invalid characters or patterns", paramName);
        }
    }
}
