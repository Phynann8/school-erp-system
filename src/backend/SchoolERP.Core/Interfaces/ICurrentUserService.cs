namespace SchoolERP.Core.Interfaces
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        string? Username { get; }
        int? CampusId { get; }
        bool HasAccessToCampus(int campusId);
    }
}
