using System.Collections.Generic;

namespace angulaJS.Models
{
    public class Device
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public static int IdCount = 1;
        public static List<Device> Devices = new List<Device>();
        public List<PhoneNumber> PhoneNumbers { get; set; } = new List<PhoneNumber>();
    }
}
