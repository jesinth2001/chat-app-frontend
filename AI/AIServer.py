from flask import Flask,request as rq 
from flask import Flask,jsonify
from flask_cors import CORS
from language_tool_python import LanguageTool
from spellchecker import SpellChecker


app=Flask(__name__)
CORS(app)


@app.route("/predict",methods=['GET','POST'])
def predict():
    try:
        text = rq.get_data(as_text=True)
        print('Received Text:', text) 
        
        tool = LanguageTool('en-US')
        matches = tool.check(text)
        corrected_sentence = tool.correct(text)

        # Spelling correction
        spell = SpellChecker()
        words = corrected_sentence.split()
        corrected_words = [spell.correction(word) if spell.correction(word) is not None else word for word in words]
        corrected_sentence = ' '.join(corrected_words)
        return corrected_sentence
    
    except Exception as e:
        print('Error:', str(e))
        return "error"
    #return "success"




if __name__=="__main__":
    app.run(debug=True)