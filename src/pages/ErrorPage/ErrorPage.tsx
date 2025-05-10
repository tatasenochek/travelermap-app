const ErrorPage = () => {
	const handleReload = () => {
		window.location.reload();
  };
  
	return (
		<main>
			<h2>Упс! Ошибка</h2>
			<p>Попробуйте перезагрузить страницу или зайти позже.</p>
			<button onClick={handleReload}>Обновить</button>
		</main>
	);
};

export default ErrorPage;
