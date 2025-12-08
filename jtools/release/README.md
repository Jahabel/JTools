# Release artifacts

This folder now stores versioned static builds. The project is currently in **alpha**, so releases are stored under `alpha/<version>` to keep prior outputs intact.

- `alpha/v1`: previous build preserved for reference.
- `alpha/v2`: latest build produced from the current codebase. Use the files in this folder for deployment.

Each version folder includes:
- `index.html` and the `assets/` bundle.
- `build-details.txt` with build metadata and warnings.
- `cpanel-hosting-guide.txt` with upload instructions.

To create a new version, run `npm run build`, then copy the contents of `dist/` into a new `alpha/v<next>` folder alongside a fresh `build-details.txt` and `cpanel-hosting-guide.txt`.
