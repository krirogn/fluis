export default class {
	/// Checks wether or not the user is signed in
	//  It uses cookies to tell if the user is logged in.

	constructor(axios) {
		this.axios = axios;
	}

	/// We wil use two cookies to make a secure cookie system
	// The first cookie is 'SNID' wich holds the password token, and the cookie 'SNID_' witch holds nothing.
	// The 'SNID' cookie lasts for 7 days while the 'SNID_' cookie lasts for 3 days.
	// If the 'SNID_' cookie doesn't exist, but the 'SNID' does, then we are going to delete the remaining 'SNID'
	// cookie, and make two new sets of cookies. Thus, renewing the cookies and the system.
	IsLoggedIn(that) {

		/// Checks if the cookie SNID exists
		if ($cookies.isKey('SNID')) {

			/// Checks if the current token is connected to an account,
			// and return the username of the token is it exists.
			this.axios({
				method: 'post',
				url: 'user/auth',
				data: {
					token: $cookies.get('SNID')
				}
			})
			.then(function (r) {
				if ($cookies.isKey('SNID_')) {
					that.loggedIn = true;
					if (that.$router.currentRoute.path == '/login') {
						that.$router.push('/');
					}
				} else {
					$cookies.remove('SNID');
					$cookies.remove('SNID_');

					that.$router.push('/login');
					that.loggedIn = false;
				}
			})
			.catch(function (error) {
				console.log(error);

				$cookies.remove('SNID');
				$cookies.remove('SNID_');

				that.$router.push('/login');
				that.loggedIn = false;
			});

		} else {
			$cookies.remove('SNID');
			$cookies.remove('SNID_');
			
			that.$router.push('/login');
			that.loggedIn = false;
		}

	}

	LogIn(pw, uname, that) {

		this.axios({
			method: 'post',
			url: 'user/login',
			data: {
				password: pw,
				username: uname
			}
		})
		.then(function (r) {
			r = r.data;
			console.log(r)

			if (r != null) {
				$cookies.set("SNID", r, 60 * 60 * 24 * 7, '/');
				$cookies.set("SNID_", '1', 60 * 60 * 24 * 3, '/');

				console.log("Created Cookies!\nYou are logged in");
				that.$router.push('/');

				return true;
			} else {
				return false;
			}

		})
		.catch(function (error) {
			alert(error.response.data);
			//that.errorMessage = error.response.data
			return false;
		});

	}

	LogOut(deleteAll, that) {
		this.axios({
			method: 'post',
			url: 'user/logout',
			data: {
				token: $cookies.get('SNID'),
				da: deleteAll
			}
		})
		.then(function (r) {
			$cookies.remove('SNID')
			$cookies.remove('SNID_')
			that.$router.push('/login');
		})
		.catch(function (error) {
			alert(error.response.data);
			//that.errorMessage = error.reponse.data
		});
	}
}
