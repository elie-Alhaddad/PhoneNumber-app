using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace angulaJS.Models
{
    public class PhoneNumberReservation
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int PhoneNumberId { get; set; }
        public DateTime BeginEffectiveDate { get; set; }
        public DateTime? EndEffectiveDate { get; set; }

        // Navigation properties for related entities
        [ForeignKey("ClientId")]
        public Client Client { get; set; }

        [ForeignKey("PhoneNumberId")]
        public PhoneNumber PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public bool IsReserved { get; set; } // Add this property
    }
}
