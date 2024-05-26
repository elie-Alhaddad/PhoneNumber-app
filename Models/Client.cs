using System;
using System.Collections.Generic;

namespace angulaJS.Models
{
    public enum ClientType
    {
        Individual,
        Organization
    }

    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ClientType Type { get; set; }
        public string TypeName { get; set; }
        public DateTime? BirthDate { get; set; }

        public int NumberOfClients { get; set; }





    }
}
