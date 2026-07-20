// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "IllusionMarkdown",
    platforms: [.macOS(.v13), .iOS(.v15)],
    products: [
        .library(name: "MDI", targets: ["MDI"]),
    ],
    targets: [
        .binaryTarget(name: "MDICore", url: "https://github.com/illusions-lab/MDI/releases/download/2.0.1/MDICore.xcframework.zip", checksum: "4303d21e7d0812412cd15475c6c61788601e11f65bf1f69d8ce278652eb72a05"),
        .target(name: "MDI", dependencies: ["MDICore"], path: "swift/Sources/MDI"),
        .testTarget(name: "MDITests", dependencies: ["MDI"], path: "swift/Tests/MDITests"),
    ]
)
