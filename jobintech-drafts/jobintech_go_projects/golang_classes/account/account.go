package account

type Account struct {
		balance float64

	}

	func NewAccount(initBalance float64) *Account {
		if(initBalance < 0){
			initBalance = 0
		}
		return &Account{balance: initBalance}

	}
	// reciver
	func(a *Account) GetBalance()float64{
		return a.balance
	}

	func(a *Account) Withdraw(ammount float64) bool {
		if(ammount < a.balance && ammount > 0 ){
			a.balance = a.balance - ammount
			return true
		}
		return false
	}



