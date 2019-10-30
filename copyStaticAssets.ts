import * as shell from "shelljs"

shell.cp("-R", "src/public/js/lib", "dist/public/js/")
shell.cp("-R", "src/public/images", "dist/public/")
shell.cp("-R", "src/public/css", "dist/public/")
