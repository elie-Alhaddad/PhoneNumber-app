using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace angulaJS.Models
{
    public class PhoneNumber
    {
        public int Id { get; set; }
        public string Number { get; set; }

        // Foreign key property for the related Device
        public int DeviceId { get; set; }

        // Navigation property for the related Device
        [ForeignKey("DeviceId")]
        public Device Device { get; set; }
    }
}