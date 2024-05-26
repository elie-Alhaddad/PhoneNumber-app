using System;
using System.Security.Cryptography;
using System.Text;

public static class EncryptionHelper
{
    public static string Encrypt(string password)
    {
        var hashedBytes = ComputeSha256Hash(password);
        return ConvertBytesToHexString(hashedBytes);
    }

    private static byte[] ComputeSha256Hash(string input)
    {
        using (var sha256 = SHA256.Create())
        {
            var inputBytes = Encoding.UTF8.GetBytes(input);
            return sha256.ComputeHash(inputBytes);
        }
    }

    private static string ConvertBytesToHexString(byte[] bytes)
    {
        var sb = new StringBuilder();
        foreach (byte b in bytes)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();
    }
}
