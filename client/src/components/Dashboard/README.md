# Dashboard

This folder contains components that are used to render the dashboard. 

## Terms
The page is separated into three sections: the sidebar, content, and preview.

### Sidebar
The leftmost card. It can be tought of as a list of selectable items. Whatever item is selected will display its information in the content-area.

### Content
This is the middle area between the sidebar and the preview pane. It can also be tought of as a list of selectable items. Whatever item is selected will display more information about itself in the preview.

### Preview
This is the rightmost card. It displays more information about the selected content item.

### Content-Area
**Not to be confused with content**. This includes both the content (eg a course and its list of categories and grades) and the preview panel for the selected content item. More generally, it is whatever is right of the sidebar and isn't always in the content+preview model. 

It is controlled by the sidebar. For example:
* Selecting a course will display a list of category and grades and preview panes for editing, adding them. 
* Selecting account settings will display a list of options and preview panes to edit, confirm, etc.
* Selecting about will display the about page. **(not content + preview model)**.



