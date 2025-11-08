// جوّه handleSendMessage بدل البلوك المعلّق:
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...messages, userMessage],
      locale,
      // لو حابب تمرّر كتب متعلقة بالسؤال كـ context:
      // contextBooks: bookData.slice(0, 50)
    }),
  });

  if (!response.ok) throw new Error('Bad response');

  const data = await response.json();
  setMessages(prev => [...prev, { role: 'assistant', content: data.reply || t('error') }]);
} catch (error) {
  console.error("API call failed:", error);
  setMessages(prev => [...prev, { role: 'assistant', content: t('error') }]);
} finally {
  setIsLoading(false);
}
