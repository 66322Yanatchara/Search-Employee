import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import './Index.css';

// ฟังก์ชันสำหรับ Decode HTML Entities
// ใช้สำหรับแปลง HTML Entities (เช่น &lt; &gt;) ให้เป็นตัวอักษรปกติ
const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

export default function EmployeeIndex({ employees, query, currentPage }) {
  // สถานะของข้อความที่ใช้ค้นหา
  const [search, setSearch] = useState(query || '');
  // สถานะของคอลัมน์ที่ใช้สำหรับการจัดเรียง
  const [sortColumn, setSortColumn] = useState('');
  // สถานะของลำดับการจัดเรียง (asc/desc)
  const [sortOrder, setSortOrder] = useState('');

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = (e) => {
    e.preventDefault();  // หยุดการโหลดหน้าใหม่เมื่อกดปุ่ม Submit
    // ส่งค่า search ไปที่ route '/employee' เพื่อค้นหาพนักงาน
    router.get('/employee', { search });
};

  // ฟังก์ชันสำหรับจัดเรียงข้อมูล
  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc'; // สลับ asc/desc
    setSortColumn(column); // ตั้งค่าคอลัมน์ที่จัดเรียง
    setSortOrder(newSortOrder); // ตั้งค่าลำดับการจัดเรียง
    router.get('/employee', { search, sort: column, order: newSortOrder }); // ส่งข้อมูลไปที่ URL
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนหน้า
  const handlePagination = (url) => {
    if (url) {
      const parsedUrl = new URL(url, window.location.origin); // แปลง URL ที่ได้รับเป็นวัตถุ URL
      const params = new URLSearchParams(parsedUrl.search); // ดึง query parameters

      if (search) params.set('search', search); // เพิ่ม query search
      if (sortColumn) {
        params.set('sort', sortColumn); // เพิ่มคอลัมน์ที่จัดเรียง
        params.set('order', sortOrder); // เพิ่มลำดับการจัดเรียง
      }

      router.get(`/employee?${params.toString()}`); // ส่งคำขอไปที่ URL
    }
  };

  // ฟังก์ชันสำหรับรีเฟรชข้อมูล
  const handleRefresh = () => {
    setSearch(''); // ล้างคำค้นหา
    setSortColumn(''); // ล้างคอลัมน์ที่จัดเรียง
    setSortOrder(''); // ล้างลำดับการจัดเรียง
    router.get('/employee'); // รีเฟรชหน้าโดยไม่ส่ง query
  };

  return (
    <div className="container">
      {/* หัวข้อ */}
      <h1 className="title">Employee List</h1>

      {/* ฟอร์มค้นหา */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={search} // ผูกกับสถานะ search
          onChange={(e) => setSearch(e.target.value)} // อัปเดตสถานะ search
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" onClick={handleRefresh} className="refresh-button">Refresh</button>
      </form>

      {/* ตารางข้อมูล */}
      {employees.data && employees.data.length > 0 ? (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                {/* คอลัมน์ต่าง ๆ พร้อมปุ่มจัดเรียง */}
                <th>
                  ID
                  <button onClick={() => handleSort('emp_no')}>
                    {sortColumn === 'emp_no' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Name
                  <button onClick={() => handleSort('first_name')}>
                    {sortColumn === 'first_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Last Name
                  <button onClick={() => handleSort('last_name')}>
                    {sortColumn === 'last_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Birth Date
                  <button onClick={() => handleSort('birth_date')}>
                    {sortColumn === 'birth_date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* แสดงรายการพนักงาน */}
              {employees.data.map((employee, index) => (
                <tr key={employee.emp_no} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{employee.emp_no}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.birth_date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* การแบ่งหน้า */}
          <div className="pagination">
            {employees.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.url && handlePagination(link.url)} // เปลี่ยนหน้า
                disabled={!link.url} // ปิดปุ่มถ้าไม่มี URL
                className={`pagination-button ${link.active ? 'active' : ''}`}
              >
                {/* แปลง HTML Entities */}
                {decodeHtmlEntities(link.label || '')
                  .replace('Previous', '\u00ab Previous')
                  .replace('Next', 'Next \u00bb')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="no-employees">No employees found.</h2>
      )}
    </div>
  );
}
