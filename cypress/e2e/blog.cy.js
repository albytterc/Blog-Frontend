describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset');
		const user = {
			name: 'Albert',
			username: 'alby',
			password: '123'
		};
		cy.request('POST', 'http://localhost:3003/api/users', user);
		cy.visit('http://localhost:3000');
	});

	it('Login form is showing', function () {
		cy.contains('Username:');
		cy.contains('Password:');
		cy.contains('Login');
	});

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('input#username').type('alby');
			cy.get('input#password').type('123');
			cy.get('button').contains('Login').click();

			cy.contains('Successfully logged in').should(
				'have.css',
				'color',
				'rgb(0, 128, 0)'
			);
			cy.contains('Logged in as Albert');
		});

		it('fails with incorrect credentials', function () {
			cy.get('input#username').type('alby');
			cy.get('input#password').type('1234');
			cy.get('button').contains('Login').click();

			cy.contains('Invalid username or password').should(
				'have.css',
				'color',
				'rgb(255, 0, 0)'
			);
			// login form still showing
			cy.contains('Username:');
			cy.contains('Password:');
			cy.contains('Login');
		});
	});

	describe('when logged in', function () {
		beforeEach(function () {
			cy.get('input#username').type('alby');
			cy.get('input#password').type('123');
			cy.get('button').contains('Login').click();
		});

		it('blog can be created', function () {
			cy.contains('New Post').click();
			cy.get('input#title').type('New Post');
			cy.get('input#author').type('Albert');
			cy.get('input#url').type('http://albert.com');
			cy.get('button').contains('Create').click();

			cy.contains('Created new blog: New Post, by Albert');
			// cy.get('div.blogpost').then(($el) => $el.length === 1)
			cy.get('div.blogpost').should($b => expect($b).to.have.length(1))
		});

		describe('after creating one post', function () {
			beforeEach(function () {
				cy.contains('New Post').click();
				cy.get('input#title').type('New Post');
				cy.get('input#author').type('Albert');
				cy.get('input#url').type('http://albert.com');
				cy.get('button').contains('Create').click();
				cy.get('button[name="toggleDetails"]').click()
			})

			it('blog can be liked', function () {
				cy.get('button[name="likeBtn"]').click()
				cy.get('div.blogpost li:last').contains('Likes: 1')
			})

			it('blog can be deleted', function () {
				cy.get('button[name="deleteBtn"]').click()
				cy.get('div.blogpost').should('not.exist')
			})

			it('blogs are sorted by likes', function () {
				cy.get('button').contains('New Post').click();
				cy.get('input#title').type('Second Post');
				cy.get('input#author').type('Albert');
				cy.get('input#url').type('http://albert.com');
				cy.get('button').contains('Create').click();
				cy.get('button[name="toggleDetails"]').contains('View').click()

				cy.get('button[name="likeBtn"]:last').click()
				cy.wait(500)
				cy.get('div.blogpost:first').contains('Second Post')
				cy.get('div.blogpost:first li:last').contains('Likes: 1')

				cy.get('button[name="likeBtn"]:last').click()
				cy.wait(500)
				cy.get('div.blogpost:first').contains('New Post')
				cy.get('div.blogpost:first li:last').contains('Likes: 1')

				cy.get('button[name="likeBtn"]:last').click()
				cy.wait(500)
				cy.get('div.blogpost:first').contains('Second Post')
				cy.get('div.blogpost:first li:last').contains('Likes: 2')
			})
		})
	});
});