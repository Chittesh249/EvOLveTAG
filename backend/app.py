from app import create_app

app = create_app()

if __name__ == '__main__':
    # 👇 Explicitly set host and port for clarity
    app.run(debug=True, host='127.0.0.1', port=5000)
