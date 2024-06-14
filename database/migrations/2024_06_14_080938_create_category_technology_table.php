<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('category_technology', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technology_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_ids')->constrained('techno_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('category_technology');
    }
};
