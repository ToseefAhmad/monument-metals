pr_dev:
	xdg-open "https://github.com/magebitcom/monument-metals-pwa/compare/development...`git rev-parse --abbrev-ref HEAD`" > /dev/null 2> /dev/null

pr:
	xdg-open "https://github.com/magebitcom/monument-metals-pwa/compare/staging...`git rev-parse --abbrev-ref HEAD`" > /dev/null 2> /dev/null
