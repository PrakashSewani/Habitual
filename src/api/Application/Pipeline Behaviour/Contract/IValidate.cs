namespace Application.Pipeline_Behaviour.Contract
{
    /// <summary>
    /// IValidate is a marker interface used to indicate that a request should be validated by the ValidatorPipelineBehaviour. Any request that implements this interface will be subject to validation using FluentValidation before being processed by its respective handler. This allows for a clean separation of concerns, ensuring that validation logic is applied consistently across all relevant requests without requiring explicit checks in each handler.
    /// </summary>
    public interface IValidate
    {
    }
}
