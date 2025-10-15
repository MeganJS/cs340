
// 1. Explain how this program violates the High-Quality Abstraction principle.
// This code has an employee variable, which includes employmentStartDate and employmentEndDate. 
// However, instead of using these dates, it asks for more parameters to be passed in.
// Since so many date ranges are necessary, it would make sense to create a date range class or type.
// In addition, a RetirementCalculator does not have Years of Service or a last position, so why does it have getters for these things?
// 2. Explain how you would refactor the code to improve its design.
// It would make sense to move the getters up to the employee class, since those operations apply to that class.
// It would make sense to create a date range class or type. 


class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { … }

	private getTotalYearsOfService(startDate: Date, endDate: Date): number { … }

	private getMonthsInLastPosition(startDate: Date, endDate: Date): number { … }
	
    ...
}
