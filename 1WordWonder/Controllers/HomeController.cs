using _1WordWonder.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace _1WordWonder.Controllers
{
    public class HomeController : Controller
    {
        protected OneWordWonderEntities db;

        public HomeController()
        {
            db = new OneWordWonderEntities();
        }
        
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Entry(string word, double sentimentValue)
        {
            // Queries database to see if current word exists.
            var wordToCheck = db.Words.Where(w => w.WordString.ToLower() == word.ToLower()).FirstOrDefault();
            
            // Create word in database if it doesn't exist.
            if (wordToCheck == null)
            {
                var wordToAdd = new Word();
                wordToAdd.WordString = word;
                db.Words.Add(wordToAdd);
                db.SaveChanges();
                wordToCheck = db.Words.Where(w => w.WordString.ToLower() == wordToAdd.WordString.ToLower()).FirstOrDefault();
            }
            // Take new word sentiment and add to Entry table in database.
            var newEntry = new Entry();
            newEntry.Sentiment = sentimentValue;
            newEntry.WordID = wordToCheck.ID;
            db.Entries.Add(newEntry);
            db.SaveChanges();

            // Calculate average sentiment of current values in database.
            var sentimentValues = db.Entries.Where(w => w.Word.WordString == wordToCheck.WordString).ToList();
            double total = 0;
            foreach (var entry in sentimentValues)
            {
                total += entry.Sentiment;
            }
            var averageSentiment = total / sentimentValues.Count;

            // Returns JSON data containing new average.
            return Json(new { score = averageSentiment, count = sentimentValues.Count });
        }
    }
}
