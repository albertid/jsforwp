Objective: Convert aging php/html data visualization into clean vanilla javascript with updated data.
https://www.pewsocialtrends.org/interactives/comparing-generations/

1. Build out frame. Container, two buttons, menu with 10 items, bar chart title, legend, labels, bars with percentages, source note.

2. Expected behavior: Click top buttons to toggle between data sets. Click left menu to view different bar charts. Clicking on a button or menu item will remove active stlying from all sibling elements and apply it to the selected element. 

3. Data in json, pulled from Firebase.
```
{
    "today": {
        "millennials": {
            "race": {
                "white": 57,
                "hispanic": 21,
                "black": 13,
                "asian":6,
                "other": 3
            }
        }
    }
}
```

4. Bars will likely be simple elements with dynamic widths applied. 