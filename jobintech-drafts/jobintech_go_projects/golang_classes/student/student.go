package student

type Datashowing interface {
	getName() string
}

type Student struct {
	name string
	age  int

}





func NewStudent(initname string, initage int) *Student {
	return &Student{
		name : initname,
		age : initage,
	}
}

func (s *Student) getName() string {
	return s.name
}


