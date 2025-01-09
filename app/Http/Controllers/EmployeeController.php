<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Employees;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)  // ฟังก์ชัน index รับ Request จากผู้ใช้
    {
        $query = $request->input('search');  // รับค่าจากพารามิเตอร์ 'search' ที่ส่งมาจากผู้ใช้ (คำค้นหา)

        // ค้นหาในฐานข้อมูลตาราง employees โดยดูว่ามี first_name หรือ last_name ที่ตรงกับคำค้นหาหรือไม่
        $employees = DB::table('employees')
            ->where('first_name', 'like', '%' . $query . '%') // ตรวจสอบว่าชื่อแรกมีคำที่คล้ายกับ query
            ->orWhere('last_name', 'like', '%' . $query . '%') // หรือ นามสกุลมีคำที่คล้ายกับ query
            ->paginate(10);  // แบ่งผลลัพธ์ออกเป็นหน้า หน้าละ 10 รายการ

        // Log::info($employees);  // (ตัวอย่างโค้ดที่ถูกคอมเมนต์ไว้) ใช้สำหรับ debug ข้อมูล employees

        // ส่งข้อมูล employees และ query ไปยังหน้า Employee/Index โดยใช้ Inertia.js 
        return Inertia::render('Employee/Index', [
            'employees' => $employees,  // ส่งข้อมูลพนักงานไปที่หน้าเว็บ
            'query' => $query,          // ส่งคำค้นหาที่ผู้ใช้ป้อนไปที่หน้าเว็บ
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
