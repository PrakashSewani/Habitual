namespace Domain.Common.Enums
{

    /// <summary>
    /// ScheduleType is an enumeration that defines the types of scheduling options available for tasks or events. It includes three values: Daily, Weekly, and Interval. Each value represents a different frequency for executing a task or event. Daily indicates that the task should be executed every day, Weekly indicates that it should be executed once a week, and Interval indicates that it should be executed at specific intervals (e.g., every 2 hours). This enumeration can be used in scheduling systems to specify how often a task should be performed.
    /// </summary>
    public enum ScheduleType
    {
        Daily,
        Weekly,
        Interval
    }
}
