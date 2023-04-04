export default function appShutdown(err) {
    console.log(err.name, err.message);
    process.exit(1);
}
