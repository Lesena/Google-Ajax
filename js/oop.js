// ----------------------------------------------------------- ООП в прототипном стиле
	function Human(name, age, gender, height, weight) {
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.height = height;
		this.weight = weight;
	}

	Worker.prototype = Object.create(Human.prototype);
	Worker.prototype.constructor = Worker;
	Student.prototype = Object.create(Human.prototype);
	Student.prototype.constructor = Student;

	Human.prototype.does = function() {
		console.log('mode: ' + this.work);
	}
	function Worker(name, age, gender, height, weight, workplace, sale) {
		Human.apply(this, arguments);
		this.workplace = workplace;
		this.sale = sale;
		this.work = 'Work';
	}

	function Student(name, age, gender, height, weight, study, sale) {
		Human.apply(this, arguments);
		this.study = study;
		this.sale = sale;
		this.work = 'Watch Serials';
	}

	var jack = new Worker('Jack', 24, 'male', 170, 75, 'Google', 7000 + '$');
	console.log(jack);
	jack.does();

	var lee = new Worker('Lee', 33, 'male', 175, 80, 'nVidia', 5000 + '$');
	console.log(lee);
	lee.does();

	var raz = new Student('Raz', 19, 'male', 185, 93, 'Cambridge', 900 + '$');
	console.log(raz);
	raz.does();

	var markus = new Student('Markus', 29, 'male', 165, 55, 'Harvard', 1200 + '$');
	console.log(markus);
	markus.does();
