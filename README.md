# MRI - Responsive Advanced Data Table Web App

This project is an advanced data table web application built using **Next.js**, **TypeScript**, **ShadCN UI**, **Tailwind CSS**, **Tanstack React Table**, and **Material React Table**. The application provides extensive table features like filtering, sorting, grouping, and pagination for an efficient data management experience.

---

## ✨ Features

1. **Column Customization**:
   - Toggle visibility of specific columns.

2. **Sorting**:
   - Apply sorting on all columns in ascending or descending order.

3. **Filtering**:
- **Global Fuzzy Search**: Perform searches that account for typos or slight variations in the `name` column.
   - **Column Filters**:
     - Multi-select dropdown with facets for `category` and `subcategory`.
     - Fuzzy search for approximate matches.
     - Slider-based range filter for `price`.
     - Range filter for numeric and date-based columns.
    
4. **Grouping**:
   - Group data using a side panel for `category` and `subcategory` columns.
   - Grouping can be done simultaneously or independently.

5. **Custom Cell Rendering**:
   - Format `createdAt` and `updatedAt` columns to display in local datetime format (`DD-MMM-YYYY HH:MM`).

6. **Pagination**:
   - Display 10 results per page with intuitive navigation.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/kumaraswini-11/mri-advanced-data-table.git
   cd mri-advanced-data-table
   ```

2. Install & Run:
   ```bash
   npm i
   npm run dev
   ```
   
3. Open `http://localhost:3000` in your browser to see the app.

## Reference

- [ShadCN UI](https://shadcn.dev/)
- [Material React Table](https://www.material-react-table.com/)
- [Tanstack React Table](https://tanstack.com/table/latest/docs/introduction)
<!-- - [Reunion Assignment Referance Material](https://reunion-one.notion.site/Full-Stack-Assignment-Reunion-887b68a28c4846f08da060412ae18a1f) -->
