//-------------------------controllers.js-------------------------------------------

app.controller("calccontroller", function($scope) {

	$scope.expr = "";			// store expr
	var dec=false;				// true if already there is a decimal point in a number
	var inputexpr = [];			// stack to store infix expr after parsing expr
	var equalsflag=false;		// true if = is just clicked

//-----------------------------------------------------------------------------------





//-----------------------------------------------------------------------------------
	// editexpr() recieves the clicked button and edits $scope.expr
	$scope.editexpr = function(ch) {






			//-----------------------------------------------
		if(ch=='=') {
			$scope.expr = $scope.result;  // update result when = is clicked
			equalsflag = true;
			dec=false;

			//-----------------------------------------------
		} else if(ch=='c') {

			// clear the entire expr if equals is juct clicked
			if(equalsflag) {
				$scope.expr = "";
				equalsflag=false;
			}
			$scope.expr = $scope.expr.slice(0,-1);
			//-----------------------------------------------
		} else if(ch=='\xF7') {
			// avoid * in the begining of an expr
			if($scope.expr=="" || $scope.expr=="-") {
				;
			} else if($scope.expr.substr($scope.expr.length-1)=='\xF7' || $scope.expr.substr($scope.expr.length-1)=='\xD7' || $scope.expr.substr($scope.expr.length-1)=='+' || $scope.expr.substr($scope.expr.length-1)=='-') {
				// replace the previous operator if already an operator is clicked
				$scope.expr = $scope.expr.slice(0,-1);
				$scope.expr = $scope.expr + ch;
			} else {
				$scope.expr = $scope.expr + ch;
				dec=false;
				if(equalsflag) {
					equalsflag = false;
				}
			}
			//-----------------------------------------------
		} else if(ch=='\xD7') {
			// avoid / in the begining of an expr
			if($scope.expr=="" || $scope.expr=="-") {
				;
			} else if($scope.expr.substr($scope.expr.length-1)=='\xF7' || $scope.expr.substr($scope.expr.length-1)=='\xD7' || $scope.expr.substr($scope.expr.length-1)=='+' || $scope.expr.substr($scope.expr.length-1)=='-') {
				// replace the previous operator if already an operator is clicked
				$scope.expr = $scope.expr.slice(0,-1);
				$scope.expr = $scope.expr + ch;
			} else {
				$scope.expr = $scope.expr + ch;
				dec=false;
				if(equalsflag) {
					equalsflag = false;
				}
			}
			//-----------------------------------------------
		} else if(ch=='+') {
			// avoid * in the begining of an expr
			if($scope.expr=="" || $scope.expr=="-") {
				;
			} else if($scope.expr.substr($scope.expr.length-1)=='\xF7' || $scope.expr.substr($scope.expr.length-1)=='\xD7' || $scope.expr.substr($scope.expr.length-1)=='+' || $scope.expr.substr($scope.expr.length-1)=='-') {
				// replace the previous operator if already an operator is clicked
				$scope.expr = $scope.expr.slice(0,-1);
				if($scope.expr.substr($scope.expr.length-1)=='\xF7' || $scope.expr.substr($scope.expr.length-1)=='\xD7') {
					$scope.expr = $scope.expr.slice(0,-1);
				}
				$scope.expr = $scope.expr + ch;
			} else {
				$scope.expr = $scope.expr + ch;
				dec=false;
				if(equalsflag) {
					equalsflag = false;
				}
			}
			//-----------------------------------------------
		} else if(ch=='-') {
			if($scope.expr.substr($scope.expr.length-1)=='+' || $scope.expr.substr($scope.expr.length-1)=='-') {
				// replace the previous operator if already an operator is clicked
				$scope.expr = $scope.expr.slice(0,-1);
				$scope.expr = $scope.expr + ch;
			} else if($scope.expr=="") {
				// allow - in the begining of an expr as - is a unary operator
				$scope.expr = $scope.expr + ch;
			} else {
				$scope.expr = $scope.expr + ch;
				dec=false;
				if(equalsflag) {
					equalsflag = false;
				}
			}
			//----------------------------------------------
		} else if(ch=='.') {
			if(!dec) {
				dec=true;
				if(equalsflag) {
					equalsflag = false;
					$scope.expr = "";
				}
				$scope.expr = $scope.expr + ch;
			}
			//----------------------------------------------
		} else {
			// if a number is clicked
			if(equalsflag) {
				equalsflag = false;
				$scope.expr = "";
			}
			$scope.expr = $scope.expr + ch;
		}
			//---------------------------------------------








		// call evaluate() after checking the ends of expr

		if($scope.expr!="" && $scope.expr!="Error") {
			if($scope.expr.substr($scope.expr.length-1)=='\xF7' || $scope.expr.substr($scope.expr.length-1)=='\xD7' || $scope.expr.substr($scope.expr.length-1)=='+' || $scope.expr.substr($scope.expr.length-1)=='-') {
				if($scope.expr.charAt($scope.expr.length-2)=='\xF7' || $scope.expr.charAt($scope.expr.length-2)=='\xD7') {
					evaluvate($scope.expr.slice(0,-2));
				} else {
					evaluvate($scope.expr.slice(0,-1));
				}
			} else {
				evaluvate($scope.expr);
			}
		} else {
			$scope.result = "";
		}
	};


//---------------------------------------------------------------------------------------







//----------------evaluate()-------------------------------------------------------------
	function evaluvate(x) {

		inputexpr = [];
		var temp="";


		//--------------convert expr string into infix expr stack----------------------
		for(var i=0; i<x.length; ++i) {
			if(x[i]=='-') {
				if(i==0) {
					temp = '-';
				} else if(x[i-1]=='\xF7' || x[i-1]=='\xD7') {
					temp = '-';
				} else {
					inputexpr.push(parseFloat(temp));
					temp = "";
					inputexpr.push('-');
				}
			} else if(x[i]=='+' || x[i]=='\xF7' || x[i]=='\xD7') {
				inputexpr.push(parseFloat(temp));
				temp = "";
				inputexpr.push(x[i]);
			} else {
				temp = temp + x[i];
			}
		}
		inputexpr.push(parseFloat(temp));
		//-----------------------------------------------------------------------------



		

		var stack = [];
		var postfix = [];





		//--------------convert infix stack into postfix stack------------------------
		for(var j=0; j<inputexpr.length; ++j) {
			if(inputexpr[j]=='\xD7' || inputexpr[j]=='\xF7') {
				if(stack.length) {
					if(stack[stack.length-1]=='-' || stack[stack.length-1]=='+') {
						stack.push(inputexpr[j]);
					} else if(stack[stack.length-1]=='\xF7' || stack[stack.length-1]=='\xD7') {
						postfix.push(stack[stack.length-1]);
						stack.splice(stack.length-1, 1);
						stack.push(inputexpr[j]);
					}
				} else {
					stack.push(inputexpr[j]);
				}
			} else if(inputexpr[j]=='-' || inputexpr[j]=='+') {
				if(stack.length) {
					postfix.push(stack[stack.length-1]);
					stack.splice(stack.length-1, 1);
					stack.push(inputexpr[j]);
				} else {
					stack.push(inputexpr[j]);
				}
			} else {
				postfix.push(inputexpr[j]);
			}
		}

		if(stack.length) {
			for(var k=0; k<stack.length; ++k) {
				postfix.push(stack[stack.length-1-k]);
			}
		}
		//----------------------------------------------------------------------------






		//------------------evaluate postfix stack and change $scope.result-----------

		stack = [];

		for(var l=0; l<postfix.length; ++l) {
			if(postfix[l]=='+') {
				stack[stack.length-2] = stack[stack.length-2] + stack[stack.length-1];
				stack.splice(stack.length-1,1);
			} else if(postfix[l]=='-') {
				stack[stack.length-2] = stack[stack.length-2] - stack[stack.length-1];
				stack.splice(stack.length-1,1);
			} else if(postfix[l]=='\xF7') {
				if(!stack[stack.length-1]) {
					stack = ["Error"];
					break;
				}
				stack[stack.length-2] = stack[stack.length-2] / stack[stack.length-1];
				stack.splice(stack.length-1,1);
			} else if(postfix[l]=='\xD7') {
				stack[stack.length-2] = stack[stack.length-2] * stack[stack.length-1];
				stack.splice(stack.length-1,1);
			} else {
				stack.push(postfix[l]);
			}
		}

		$scope.result = stack[0].toString();

		//---------------------------------------------------------------------------
	}
});