// swift-tools-version: 5.10
import PackageDescription

let package = Package(
	name: "MDI",
	products: [
		.library(name: "MDI", targets: ["MDI"]),
	],
	targets: [
		.target(name: "MDI"),
	]
)
