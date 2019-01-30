const reload = () => {
    location.reload();
};

const clearPersonalInput = () => {
    $("#nameInput").val("");
    $("#phoneNumberInput").val("");
    $('#confirmedTime').val("");
};

$(document).ready(() => {
    $("#submitNewUser").on("click", (event) => {
        let name = $("#nameInput").val().trim();
        let number = $("#phoneNumberInput").val().trim();
        let confirmedTime = $('#confirmedTime').val().trim()
            .replace(/[^0-9 am pm]/g, '');
        let correctedNumber = number
            .replace(/[^0-9]/g, '');


        const newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: correctedUserName,
            city: correctedCity,
            state: correctedState,
            zip: correctedZip,
            phoneNumber: correctedNumber,
        }

        ref.push(userInfo)
        clearPersonalInput();
        reload();
    });
)};


const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    debugger;
    if (!email || !name || !password) {
      return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  }
  
  module.exports = {
    handleRegister: handleRegister
  };