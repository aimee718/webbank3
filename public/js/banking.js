        function changeText(text)
        {
            var display = document.getElementById('text-display');
            display.innerHTML = "";
            display.innerHTML = text;
        }
        function changeback(text)
        {
            var display = document.getElementById('text-display');
            display.innerHTML = "";
            display.innerHTML = text;
        }
        function myLogout() {
          //location.replace("index.hbs");
          //window.location.href = "http://127.0.0.1:3000";
          
          document.getElementById("logoutForm").action = "/logout";
          
        }
       
        function mySend() {
          //alert ("debit");
          const rbs = document.querySelectorAll('input[name="banking"]');
          let selectedValue;
          for (const rb of rbs) {
              if (rb.checked) {
                  selectedValue = rb.value;
                  break;
              }
          }
         
          if (selectedValue == "txtdeposit")
          {
           
            document.getElementById("bankTypeForm").action="/d";
          }else if(selectedValue =="txtbalance"){
            
            document.getElementById("bankTypeForm").action="/l";
          }
          else if(selectedValue =="txtopenaccount"){
            document.getElementById("bankTypeForm").action="/a";
          }
          else if(selectedValue =="txtwithdraw"){
            document.getElementById("bankTypeForm").action="/w";
          }
          
        }

        function myOpenAccount(){
          //const accno = document.getElementById("txtaccountno").value;
          const rbs_chq_save = document.querySelectorAll('input[name="acctype"]');
          let selectedValue;
          for (const rb of rbs_chq_save) {
              if (rb.checked) {
                  selectedValue = rb.value;
                  break;
              }
          }

          //alert(accno+"/"+selectedValue);
          document.getElementById("accountForm").action="/add";
        }

        function myType(type) {
          //alert('bbbb');
          // alert(document.getElementById("btnSubmit2").value);
          document.getElementById("btnSubmit2").style.visibility="visible";
          document.getElementById("rd_type").value = type;
        }
      
        function myDeposit(){
          var vdeposit = document.getElementById("txtdeposit").value;
          if(isNaN(vdeposit)){
            alert("Not a number");
            return;
          }else{
            var vacc= document.getElementById("accDeposit").getAttribute("value");
          
          document.getElementById("txtaccount").value= vacc;
          
          document.getElementById("depositForm").action="/deposit";
          }
          
        }

        function myWithdrawal(){
          var vwithdrawal = document.getElementById("txtwithdrawal").value;
          if(isNaN(vwithdrawal)){
            alert("Not a number");
            return;
          }else{
            
              var vacc= document.getElementById("accWithdrawal").getAttribute("value");
              
              document.getElementById("txtaccount").value= vacc;
          
              document.getElementById("withdrawalForm").action="/withdrawal";
          }
            
            
        }

        function myCancel(mode){
          if(mode == 'a'){
            document.getElementById("accountForm").action="/c";

          }else if(mode == 'b'){
            document.getElementById("balanceForm").action="/c";

          }else if(mode == 'd'){
            document.getElementById("depositForm").action="/c";

          }else if(mode == 'w'){
            document.getElementById("withdrawalForm").action="/c";
          }
        }