using Application.Pipeline_Behaviour.Contract;
using FluentValidation;
using MediatR;

namespace Application.Pipeline_Behaviour
{
    /// <summary>
    /// ValidatorPipelineBehaviour is a MediatR pipeline behavior that integrates FluentValidation to validate incoming requests before they reach their respective handlers. It checks for any registered validators for the request type and executes them, throwing a ValidationException if any validation failures occur. This ensures that only valid requests are processed by the application, improving robustness and error handling.
    /// </summary>
    /// <typeparam name="TRequest">The type of the request being handled.</typeparam>
    /// <typeparam name="TResponse">The type of the response returned by the handler.</typeparam>
    /// <param name="validators">A collection of validators to be applied to the request.</param>
    public class ValidatorPipelineBehaviour<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>, IValidate
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators = validators;

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (_validators.Any())
            {
                var context = new ValidationContext<TRequest>(request);
                var errors = new List<Exception>();
                var validationResults = await Task
                    .WhenAll(
                    _validators
                    .Select(v => v.ValidateAsync(context, cancellationToken)));

                var failures = validationResults.SelectMany(r => r.Errors)
                    .Where(f => f != null)
                    .ToList();

                if (failures.Count != 0)
                {
                    throw new ValidationException(failures);
                }
            }

            return await next(cancellationToken);
        }
    }
}