import type { FC } from "hono/jsx";

export const HomePage: FC<{ joke: string }> = ({ joke }) => {
  return (
    <html lang="en">
      <head>
        <title>Goose Joke Generator</title>
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we do not want quotes to be escaped
          dangerouslySetInnerHTML={{
            __html: `
          body {
            font-family: "Comic Sans MS", "Comic Sans", "Comic Neue", serif;
            background-color: #ffffcc;
            color: #333;
            text-align: center;
            padding: 50px;
          }
          h1 {
            color: #ff6600;
            font-size: 36px;
            margin-bottom: 30px;
          }
          .joke-container {
            background-color: #fff;
            border: 3px solid #ff6600;
            border-radius: 10px;
            padding: 30px;
            margin: 0 auto;
            margin-bottom: 30px;
            max-width: 600px;
          }
          .joke {
            font-size: 24px;
            line-height: 1.4;
          }
          .refresh-btn {
            font-family: "Comic Sans MS", "Comic Sans", "Comic Neue", serif;
            background-color: #ff6600;
            color: #fff;
            border: none;
            padding: 15px 30px;
            font-size: 20px;
            cursor: pointer;
            border-radius: 5px;
          }
          .refresh-btn:hover {
            background-color: #ff8533;
          }
        `,
          }}
        />
      </head>
      <body>
        <h1>🦢 Goose Joke Generator 🦢</h1>
        <div class="joke-container">
          <p class="joke">
            {joke.split("\n").map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is not react
              <span key={index}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>
        <button class="refresh-btn" type="submit" onclick="location.reload()">
          More Joke!
        </button>
      </body>
    </html>
  );
};
