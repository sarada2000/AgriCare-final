allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}

// Skip the "extract annotations" step for plugins: not needed to run the app,
// and it needs large downloads that fail on a slow connection.
// The next step still expects its (empty) typedefs.txt file, so we create it.
subprojects {
    tasks.configureEach {
        if (name.startsWith("extract") && name.endsWith("Annotations")) {
            enabled = false
            val variant = name.removePrefix("extract").removeSuffix("Annotations")
                .replaceFirstChar { it.lowercase() }
            val typedefs = layout.buildDirectory
                .file("intermediates/annotations_typedef_file/$variant/$name/typedefs.txt")
                .get().asFile
            typedefs.parentFile.mkdirs()
            if (!typedefs.exists()) typedefs.writeText("")
        }
    }
}