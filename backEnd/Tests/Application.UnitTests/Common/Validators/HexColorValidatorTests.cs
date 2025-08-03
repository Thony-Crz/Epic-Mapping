using NUnit.Framework;
using Application.Common.Validators;

namespace Application.UnitTests.Common.Validators;

[TestFixture]
public class HexColorValidatorTests
{
    [Test]
    [TestCase("#FF0000")] // Rouge valide
    [TestCase("#00FF00")] // Vert valide
    [TestCase("#0000FF")] // Bleu valide
    [TestCase("#FFFFFF")] // Blanc valide
    [TestCase("#000000")] // Noir valide
    [TestCase("#ABC123")] // Couleur mixte valide
    public void IsValid_ShouldReturnTrue_ForValidHexColors(string validColor)
    {
        // Act & Assert
        Assert.That(HexColorValidator.IsValid(validColor), Is.True);
    }

    [Test]
    [TestCase("FF0000")]        // Sans #
    [TestCase("#GG0000")]       // Caractères invalides
    [TestCase("#FF00")]         // Trop court
    [TestCase("#FF000000")]     // Trop long
    [TestCase("red")]           // Nom de couleur
    [TestCase("#FF-000")]       // Tiret
    [TestCase("<script>")]      // Tentative XSS
    [TestCase("'; DROP TABLE")] // Tentative SQL injection
    public void IsValid_ShouldReturnFalse_ForInvalidHexColors(string invalidColor)
    {
        // Act & Assert
        Assert.That(HexColorValidator.IsValid(invalidColor), Is.False);
    }

    [Test]
    public void IsValid_ShouldReturnTrue_ForNullOrEmptyColor()
    {
        // Act & Assert
        Assert.That(HexColorValidator.IsValid(null), Is.True);
        Assert.That(HexColorValidator.IsValid(""), Is.True);
        Assert.That(HexColorValidator.IsValid("   "), Is.True);
    }

    [Test]
    [TestCase("#FF0000")]
    [TestCase("#00FF00")]
    public void Validate_ShouldNotThrow_ForValidHexColors(string validColor)
    {
        // Act & Assert
        Assert.DoesNotThrow(() => HexColorValidator.Validate(validColor, nameof(validColor)));
    }

    [Test]
    [TestCase("FF0000")]
    [TestCase("#GG0000")]
    public void Validate_ShouldThrowArgumentException_ForInvalidHexColors(string invalidColor)
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentException>(() => 
            HexColorValidator.Validate(invalidColor, nameof(invalidColor)));
        
        Assert.That(exception.Message, Does.Contain("valid hex"));
        Assert.That(exception.ParamName, Is.EqualTo(nameof(invalidColor)));
    }
}
