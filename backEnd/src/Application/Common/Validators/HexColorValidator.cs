using System.Text.RegularExpressions;

namespace Application.Common.Validators;

public static class HexColorValidator
{
    private static readonly Regex HexColorRegex = new(@"^#[0-9A-Fa-f]{6}$", RegexOptions.Compiled);

    /// <summary>
    /// Vérifie si une couleur est au format hexadécimal valide (#RRGGBB)
    /// </summary>
    /// <param name="color">La couleur à valider</param>
    /// <returns>True si valide ou null/empty, False sinon</returns>
    public static bool IsValid(string? color)
    {
        if (string.IsNullOrWhiteSpace(color))
            return true; // Couleur optionnelle

        return HexColorRegex.IsMatch(color);
    }

    /// <summary>
    /// Valide une couleur hexadécimale et lève une exception si invalide
    /// </summary>
    /// <param name="color">La couleur à valider</param>
    /// <param name="paramName">Le nom du paramètre pour l'exception</param>
    /// <exception cref="ArgumentException">Si la couleur est invalide</exception>
    public static void Validate(string? color, string paramName)
    {
        if (!IsValid(color))
        {
            throw new ArgumentException("Color must be a valid hex color format (#RRGGBB)", paramName);
        }
    }
}
