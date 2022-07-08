# eleve

Project's Title: eleve

Description : In this project from using API One can crawl reviews from website Tigerdirect.

Technologies : Nodejs, Expressjs, MongoDB, Mongoose, Javascript

// request to get review from the url

curl --location --request POST 'localhost:4000/api/reviews/getFromLink' \
--header 'Content-Type: application/json' \
--data-raw '{
"pageLink":"https://www.tigerdirect.com/applications/searchtools/item-details.asp?EdpNo=1416212&pagenumber=1&RSort=1&csid=ITD&recordsPerPage=5&body=REVIEWS#CustomerReviewsBlock"
}'y

// Please use this env var or can use you own

PORT=4000
MONGO_URI='mongodb+srv://eleve:eleve@eleve.reihvyy.mongodb.net/eleve?retryWrites=true&w=majority'

Some examples for which i have tested with

https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=640254&CatId=3839

https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=1271820&sku=42632644&cm_re=Homepage-_-Zone3_5-_-CatId_36_42632644

https://www.tigerdirect.com/applications/searchtools/item-details.asp?EdpNo=613529&csid=_21

https://www.tigerdirect.com/applications/searchtools/item-details.asp?EdpNo=1416212&pagenumber=1&RSort=1&csid=ITD&recordsPerPage=5&body=REVIEWS#CustomerReviewsBlock

https://www.tigerdirect.com/applications/searchtools/item-details.asp?EdpNo=640541&csid=_21

Already created Index on { EdpNo: 1 } , {EdpNo:1, pagenumber:1}
