# Contributing to Cosmic Defender

First off, thank you for considering contributing to Cosmic Defender! It's people like you that make Cosmic Defender such a great game.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots or animated GIFs** if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/React style guide
* Include screenshots and animated GIFs in your pull request whenever possible
* End all files with a newline
* Write meaningful commit messages

## Development Setup

1. Fork the repo
2. Clone your fork:
```bash
git clone https://github.com/yourusername/cosmic-defender.git
cd cosmic-defender
```

3. Install dependencies:
```bash
npm install
```

4. Create a branch:
```bash
git checkout -b feature/your-feature-name
```

5. Make your changes and test them:
```bash
npm start
```

6. Commit your changes:
```bash
git add .
git commit -m "Add some feature"
```

7. Push to your fork:
```bash
git push origin feature/your-feature-name
```

8. Create a Pull Request

## Style Guide

### JavaScript/React Style Guide

* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Use meaningful variable names
* Comment complex logic
* Use ES6+ features
* Follow React best practices (hooks, functional components)

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Project Structure

```
cosmic-defender/
├── src/
│   ├── components/     # React components
│   │   └── CosmicDefender.jsx
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── public/             # Static files
└── package.json        # Dependencies
```

## Testing

Before submitting a PR, please test your changes:

1. Run the development server: `npm start`
2. Test all game features
3. Test on different browsers (Chrome, Firefox, Safari)
4. Check for console errors
5. Verify responsive design

## Good First Issues

Look for issues labeled `good first issue` or `beginner friendly` - these are great starting points for new contributors!

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🚀