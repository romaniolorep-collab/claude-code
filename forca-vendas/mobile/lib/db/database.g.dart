// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $ProductRowsTable extends ProductRows
    with TableInfo<$ProductRowsTable, ProductRow> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ProductRowsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _skuMeta = const VerificationMeta('sku');
  @override
  late final GeneratedColumn<String> sku = GeneratedColumn<String>(
      'sku', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _unitMeta = const VerificationMeta('unit');
  @override
  late final GeneratedColumn<String> unit = GeneratedColumn<String>(
      'unit', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('UN'));
  static const VerificationMeta _categoryMeta =
      const VerificationMeta('category');
  @override
  late final GeneratedColumn<String> category = GeneratedColumn<String>(
      'category', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _basePriceMeta =
      const VerificationMeta('basePrice');
  @override
  late final GeneratedColumn<double> basePrice = GeneratedColumn<double>(
      'base_price', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _stockMeta = const VerificationMeta('stock');
  @override
  late final GeneratedColumn<int> stock = GeneratedColumn<int>(
      'stock', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, sku, name, unit, category, basePrice, stock];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'product_rows';
  @override
  VerificationContext validateIntegrity(Insertable<ProductRow> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('sku')) {
      context.handle(
          _skuMeta, sku.isAcceptableOrUnknown(data['sku']!, _skuMeta));
    } else if (isInserting) {
      context.missing(_skuMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('unit')) {
      context.handle(
          _unitMeta, unit.isAcceptableOrUnknown(data['unit']!, _unitMeta));
    }
    if (data.containsKey('category')) {
      context.handle(_categoryMeta,
          category.isAcceptableOrUnknown(data['category']!, _categoryMeta));
    }
    if (data.containsKey('base_price')) {
      context.handle(_basePriceMeta,
          basePrice.isAcceptableOrUnknown(data['base_price']!, _basePriceMeta));
    } else if (isInserting) {
      context.missing(_basePriceMeta);
    }
    if (data.containsKey('stock')) {
      context.handle(
          _stockMeta, stock.isAcceptableOrUnknown(data['stock']!, _stockMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ProductRow map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ProductRow(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      sku: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sku'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      unit: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}unit'])!,
      category: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}category']),
      basePrice: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}base_price'])!,
      stock: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}stock'])!,
    );
  }

  @override
  $ProductRowsTable createAlias(String alias) {
    return $ProductRowsTable(attachedDatabase, alias);
  }
}

class ProductRow extends DataClass implements Insertable<ProductRow> {
  final int id;
  final String sku;
  final String name;
  final String unit;
  final String? category;
  final double basePrice;
  final int stock;
  const ProductRow(
      {required this.id,
      required this.sku,
      required this.name,
      required this.unit,
      this.category,
      required this.basePrice,
      required this.stock});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['sku'] = Variable<String>(sku);
    map['name'] = Variable<String>(name);
    map['unit'] = Variable<String>(unit);
    if (!nullToAbsent || category != null) {
      map['category'] = Variable<String>(category);
    }
    map['base_price'] = Variable<double>(basePrice);
    map['stock'] = Variable<int>(stock);
    return map;
  }

  ProductRowsCompanion toCompanion(bool nullToAbsent) {
    return ProductRowsCompanion(
      id: Value(id),
      sku: Value(sku),
      name: Value(name),
      unit: Value(unit),
      category: category == null && nullToAbsent
          ? const Value.absent()
          : Value(category),
      basePrice: Value(basePrice),
      stock: Value(stock),
    );
  }

  factory ProductRow.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ProductRow(
      id: serializer.fromJson<int>(json['id']),
      sku: serializer.fromJson<String>(json['sku']),
      name: serializer.fromJson<String>(json['name']),
      unit: serializer.fromJson<String>(json['unit']),
      category: serializer.fromJson<String?>(json['category']),
      basePrice: serializer.fromJson<double>(json['basePrice']),
      stock: serializer.fromJson<int>(json['stock']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'sku': serializer.toJson<String>(sku),
      'name': serializer.toJson<String>(name),
      'unit': serializer.toJson<String>(unit),
      'category': serializer.toJson<String?>(category),
      'basePrice': serializer.toJson<double>(basePrice),
      'stock': serializer.toJson<int>(stock),
    };
  }

  ProductRow copyWith(
          {int? id,
          String? sku,
          String? name,
          String? unit,
          Value<String?> category = const Value.absent(),
          double? basePrice,
          int? stock}) =>
      ProductRow(
        id: id ?? this.id,
        sku: sku ?? this.sku,
        name: name ?? this.name,
        unit: unit ?? this.unit,
        category: category.present ? category.value : this.category,
        basePrice: basePrice ?? this.basePrice,
        stock: stock ?? this.stock,
      );
  ProductRow copyWithCompanion(ProductRowsCompanion data) {
    return ProductRow(
      id: data.id.present ? data.id.value : this.id,
      sku: data.sku.present ? data.sku.value : this.sku,
      name: data.name.present ? data.name.value : this.name,
      unit: data.unit.present ? data.unit.value : this.unit,
      category: data.category.present ? data.category.value : this.category,
      basePrice: data.basePrice.present ? data.basePrice.value : this.basePrice,
      stock: data.stock.present ? data.stock.value : this.stock,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ProductRow(')
          ..write('id: $id, ')
          ..write('sku: $sku, ')
          ..write('name: $name, ')
          ..write('unit: $unit, ')
          ..write('category: $category, ')
          ..write('basePrice: $basePrice, ')
          ..write('stock: $stock')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, sku, name, unit, category, basePrice, stock);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ProductRow &&
          other.id == this.id &&
          other.sku == this.sku &&
          other.name == this.name &&
          other.unit == this.unit &&
          other.category == this.category &&
          other.basePrice == this.basePrice &&
          other.stock == this.stock);
}

class ProductRowsCompanion extends UpdateCompanion<ProductRow> {
  final Value<int> id;
  final Value<String> sku;
  final Value<String> name;
  final Value<String> unit;
  final Value<String?> category;
  final Value<double> basePrice;
  final Value<int> stock;
  const ProductRowsCompanion({
    this.id = const Value.absent(),
    this.sku = const Value.absent(),
    this.name = const Value.absent(),
    this.unit = const Value.absent(),
    this.category = const Value.absent(),
    this.basePrice = const Value.absent(),
    this.stock = const Value.absent(),
  });
  ProductRowsCompanion.insert({
    this.id = const Value.absent(),
    required String sku,
    required String name,
    this.unit = const Value.absent(),
    this.category = const Value.absent(),
    required double basePrice,
    this.stock = const Value.absent(),
  })  : sku = Value(sku),
        name = Value(name),
        basePrice = Value(basePrice);
  static Insertable<ProductRow> custom({
    Expression<int>? id,
    Expression<String>? sku,
    Expression<String>? name,
    Expression<String>? unit,
    Expression<String>? category,
    Expression<double>? basePrice,
    Expression<int>? stock,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (sku != null) 'sku': sku,
      if (name != null) 'name': name,
      if (unit != null) 'unit': unit,
      if (category != null) 'category': category,
      if (basePrice != null) 'base_price': basePrice,
      if (stock != null) 'stock': stock,
    });
  }

  ProductRowsCompanion copyWith(
      {Value<int>? id,
      Value<String>? sku,
      Value<String>? name,
      Value<String>? unit,
      Value<String?>? category,
      Value<double>? basePrice,
      Value<int>? stock}) {
    return ProductRowsCompanion(
      id: id ?? this.id,
      sku: sku ?? this.sku,
      name: name ?? this.name,
      unit: unit ?? this.unit,
      category: category ?? this.category,
      basePrice: basePrice ?? this.basePrice,
      stock: stock ?? this.stock,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (sku.present) {
      map['sku'] = Variable<String>(sku.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (unit.present) {
      map['unit'] = Variable<String>(unit.value);
    }
    if (category.present) {
      map['category'] = Variable<String>(category.value);
    }
    if (basePrice.present) {
      map['base_price'] = Variable<double>(basePrice.value);
    }
    if (stock.present) {
      map['stock'] = Variable<int>(stock.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ProductRowsCompanion(')
          ..write('id: $id, ')
          ..write('sku: $sku, ')
          ..write('name: $name, ')
          ..write('unit: $unit, ')
          ..write('category: $category, ')
          ..write('basePrice: $basePrice, ')
          ..write('stock: $stock')
          ..write(')'))
        .toString();
  }
}

class $CustomerRowsTable extends CustomerRows
    with TableInfo<$CustomerRowsTable, CustomerRow> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CustomerRowsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _cityMeta = const VerificationMeta('city');
  @override
  late final GeneratedColumn<String> city = GeneratedColumn<String>(
      'city', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _priceTableIdMeta =
      const VerificationMeta('priceTableId');
  @override
  late final GeneratedColumn<int> priceTableId = GeneratedColumn<int>(
      'price_table_id', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _creditLimitMeta =
      const VerificationMeta('creditLimit');
  @override
  late final GeneratedColumn<double> creditLimit = GeneratedColumn<double>(
      'credit_limit', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, name, city, priceTableId, creditLimit];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'customer_rows';
  @override
  VerificationContext validateIntegrity(Insertable<CustomerRow> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('city')) {
      context.handle(
          _cityMeta, city.isAcceptableOrUnknown(data['city']!, _cityMeta));
    }
    if (data.containsKey('price_table_id')) {
      context.handle(
          _priceTableIdMeta,
          priceTableId.isAcceptableOrUnknown(
              data['price_table_id']!, _priceTableIdMeta));
    }
    if (data.containsKey('credit_limit')) {
      context.handle(
          _creditLimitMeta,
          creditLimit.isAcceptableOrUnknown(
              data['credit_limit']!, _creditLimitMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CustomerRow map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CustomerRow(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      city: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}city']),
      priceTableId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}price_table_id']),
      creditLimit: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}credit_limit'])!,
    );
  }

  @override
  $CustomerRowsTable createAlias(String alias) {
    return $CustomerRowsTable(attachedDatabase, alias);
  }
}

class CustomerRow extends DataClass implements Insertable<CustomerRow> {
  final int id;
  final String name;
  final String? city;
  final int? priceTableId;
  final double creditLimit;
  const CustomerRow(
      {required this.id,
      required this.name,
      this.city,
      this.priceTableId,
      required this.creditLimit});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || city != null) {
      map['city'] = Variable<String>(city);
    }
    if (!nullToAbsent || priceTableId != null) {
      map['price_table_id'] = Variable<int>(priceTableId);
    }
    map['credit_limit'] = Variable<double>(creditLimit);
    return map;
  }

  CustomerRowsCompanion toCompanion(bool nullToAbsent) {
    return CustomerRowsCompanion(
      id: Value(id),
      name: Value(name),
      city: city == null && nullToAbsent ? const Value.absent() : Value(city),
      priceTableId: priceTableId == null && nullToAbsent
          ? const Value.absent()
          : Value(priceTableId),
      creditLimit: Value(creditLimit),
    );
  }

  factory CustomerRow.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CustomerRow(
      id: serializer.fromJson<int>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      city: serializer.fromJson<String?>(json['city']),
      priceTableId: serializer.fromJson<int?>(json['priceTableId']),
      creditLimit: serializer.fromJson<double>(json['creditLimit']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'name': serializer.toJson<String>(name),
      'city': serializer.toJson<String?>(city),
      'priceTableId': serializer.toJson<int?>(priceTableId),
      'creditLimit': serializer.toJson<double>(creditLimit),
    };
  }

  CustomerRow copyWith(
          {int? id,
          String? name,
          Value<String?> city = const Value.absent(),
          Value<int?> priceTableId = const Value.absent(),
          double? creditLimit}) =>
      CustomerRow(
        id: id ?? this.id,
        name: name ?? this.name,
        city: city.present ? city.value : this.city,
        priceTableId:
            priceTableId.present ? priceTableId.value : this.priceTableId,
        creditLimit: creditLimit ?? this.creditLimit,
      );
  CustomerRow copyWithCompanion(CustomerRowsCompanion data) {
    return CustomerRow(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      city: data.city.present ? data.city.value : this.city,
      priceTableId: data.priceTableId.present
          ? data.priceTableId.value
          : this.priceTableId,
      creditLimit:
          data.creditLimit.present ? data.creditLimit.value : this.creditLimit,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CustomerRow(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('city: $city, ')
          ..write('priceTableId: $priceTableId, ')
          ..write('creditLimit: $creditLimit')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, city, priceTableId, creditLimit);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CustomerRow &&
          other.id == this.id &&
          other.name == this.name &&
          other.city == this.city &&
          other.priceTableId == this.priceTableId &&
          other.creditLimit == this.creditLimit);
}

class CustomerRowsCompanion extends UpdateCompanion<CustomerRow> {
  final Value<int> id;
  final Value<String> name;
  final Value<String?> city;
  final Value<int?> priceTableId;
  final Value<double> creditLimit;
  const CustomerRowsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.city = const Value.absent(),
    this.priceTableId = const Value.absent(),
    this.creditLimit = const Value.absent(),
  });
  CustomerRowsCompanion.insert({
    this.id = const Value.absent(),
    required String name,
    this.city = const Value.absent(),
    this.priceTableId = const Value.absent(),
    this.creditLimit = const Value.absent(),
  }) : name = Value(name);
  static Insertable<CustomerRow> custom({
    Expression<int>? id,
    Expression<String>? name,
    Expression<String>? city,
    Expression<int>? priceTableId,
    Expression<double>? creditLimit,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (city != null) 'city': city,
      if (priceTableId != null) 'price_table_id': priceTableId,
      if (creditLimit != null) 'credit_limit': creditLimit,
    });
  }

  CustomerRowsCompanion copyWith(
      {Value<int>? id,
      Value<String>? name,
      Value<String?>? city,
      Value<int?>? priceTableId,
      Value<double>? creditLimit}) {
    return CustomerRowsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      city: city ?? this.city,
      priceTableId: priceTableId ?? this.priceTableId,
      creditLimit: creditLimit ?? this.creditLimit,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (city.present) {
      map['city'] = Variable<String>(city.value);
    }
    if (priceTableId.present) {
      map['price_table_id'] = Variable<int>(priceTableId.value);
    }
    if (creditLimit.present) {
      map['credit_limit'] = Variable<double>(creditLimit.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CustomerRowsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('city: $city, ')
          ..write('priceTableId: $priceTableId, ')
          ..write('creditLimit: $creditLimit')
          ..write(')'))
        .toString();
  }
}

class $PriceRuleRowsTable extends PriceRuleRows
    with TableInfo<$PriceRuleRowsTable, PriceRuleRow> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PriceRuleRowsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _priceTableIdMeta =
      const VerificationMeta('priceTableId');
  @override
  late final GeneratedColumn<int> priceTableId = GeneratedColumn<int>(
      'price_table_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _productIdMeta =
      const VerificationMeta('productId');
  @override
  late final GeneratedColumn<int> productId = GeneratedColumn<int>(
      'product_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _minQtyMeta = const VerificationMeta('minQty');
  @override
  late final GeneratedColumn<int> minQty = GeneratedColumn<int>(
      'min_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(1));
  static const VerificationMeta _priceMeta = const VerificationMeta('price');
  @override
  late final GeneratedColumn<double> price = GeneratedColumn<double>(
      'price', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [priceTableId, productId, minQty, price];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'price_rule_rows';
  @override
  VerificationContext validateIntegrity(Insertable<PriceRuleRow> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('price_table_id')) {
      context.handle(
          _priceTableIdMeta,
          priceTableId.isAcceptableOrUnknown(
              data['price_table_id']!, _priceTableIdMeta));
    } else if (isInserting) {
      context.missing(_priceTableIdMeta);
    }
    if (data.containsKey('product_id')) {
      context.handle(_productIdMeta,
          productId.isAcceptableOrUnknown(data['product_id']!, _productIdMeta));
    } else if (isInserting) {
      context.missing(_productIdMeta);
    }
    if (data.containsKey('min_qty')) {
      context.handle(_minQtyMeta,
          minQty.isAcceptableOrUnknown(data['min_qty']!, _minQtyMeta));
    }
    if (data.containsKey('price')) {
      context.handle(
          _priceMeta, price.isAcceptableOrUnknown(data['price']!, _priceMeta));
    } else if (isInserting) {
      context.missing(_priceMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => const {};
  @override
  PriceRuleRow map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PriceRuleRow(
      priceTableId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}price_table_id'])!,
      productId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}product_id'])!,
      minQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}min_qty'])!,
      price: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}price'])!,
    );
  }

  @override
  $PriceRuleRowsTable createAlias(String alias) {
    return $PriceRuleRowsTable(attachedDatabase, alias);
  }
}

class PriceRuleRow extends DataClass implements Insertable<PriceRuleRow> {
  final int priceTableId;
  final int productId;
  final int minQty;
  final double price;
  const PriceRuleRow(
      {required this.priceTableId,
      required this.productId,
      required this.minQty,
      required this.price});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['price_table_id'] = Variable<int>(priceTableId);
    map['product_id'] = Variable<int>(productId);
    map['min_qty'] = Variable<int>(minQty);
    map['price'] = Variable<double>(price);
    return map;
  }

  PriceRuleRowsCompanion toCompanion(bool nullToAbsent) {
    return PriceRuleRowsCompanion(
      priceTableId: Value(priceTableId),
      productId: Value(productId),
      minQty: Value(minQty),
      price: Value(price),
    );
  }

  factory PriceRuleRow.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PriceRuleRow(
      priceTableId: serializer.fromJson<int>(json['priceTableId']),
      productId: serializer.fromJson<int>(json['productId']),
      minQty: serializer.fromJson<int>(json['minQty']),
      price: serializer.fromJson<double>(json['price']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'priceTableId': serializer.toJson<int>(priceTableId),
      'productId': serializer.toJson<int>(productId),
      'minQty': serializer.toJson<int>(minQty),
      'price': serializer.toJson<double>(price),
    };
  }

  PriceRuleRow copyWith(
          {int? priceTableId, int? productId, int? minQty, double? price}) =>
      PriceRuleRow(
        priceTableId: priceTableId ?? this.priceTableId,
        productId: productId ?? this.productId,
        minQty: minQty ?? this.minQty,
        price: price ?? this.price,
      );
  PriceRuleRow copyWithCompanion(PriceRuleRowsCompanion data) {
    return PriceRuleRow(
      priceTableId: data.priceTableId.present
          ? data.priceTableId.value
          : this.priceTableId,
      productId: data.productId.present ? data.productId.value : this.productId,
      minQty: data.minQty.present ? data.minQty.value : this.minQty,
      price: data.price.present ? data.price.value : this.price,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PriceRuleRow(')
          ..write('priceTableId: $priceTableId, ')
          ..write('productId: $productId, ')
          ..write('minQty: $minQty, ')
          ..write('price: $price')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(priceTableId, productId, minQty, price);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PriceRuleRow &&
          other.priceTableId == this.priceTableId &&
          other.productId == this.productId &&
          other.minQty == this.minQty &&
          other.price == this.price);
}

class PriceRuleRowsCompanion extends UpdateCompanion<PriceRuleRow> {
  final Value<int> priceTableId;
  final Value<int> productId;
  final Value<int> minQty;
  final Value<double> price;
  final Value<int> rowid;
  const PriceRuleRowsCompanion({
    this.priceTableId = const Value.absent(),
    this.productId = const Value.absent(),
    this.minQty = const Value.absent(),
    this.price = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PriceRuleRowsCompanion.insert({
    required int priceTableId,
    required int productId,
    this.minQty = const Value.absent(),
    required double price,
    this.rowid = const Value.absent(),
  })  : priceTableId = Value(priceTableId),
        productId = Value(productId),
        price = Value(price);
  static Insertable<PriceRuleRow> custom({
    Expression<int>? priceTableId,
    Expression<int>? productId,
    Expression<int>? minQty,
    Expression<double>? price,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (priceTableId != null) 'price_table_id': priceTableId,
      if (productId != null) 'product_id': productId,
      if (minQty != null) 'min_qty': minQty,
      if (price != null) 'price': price,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PriceRuleRowsCompanion copyWith(
      {Value<int>? priceTableId,
      Value<int>? productId,
      Value<int>? minQty,
      Value<double>? price,
      Value<int>? rowid}) {
    return PriceRuleRowsCompanion(
      priceTableId: priceTableId ?? this.priceTableId,
      productId: productId ?? this.productId,
      minQty: minQty ?? this.minQty,
      price: price ?? this.price,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (priceTableId.present) {
      map['price_table_id'] = Variable<int>(priceTableId.value);
    }
    if (productId.present) {
      map['product_id'] = Variable<int>(productId.value);
    }
    if (minQty.present) {
      map['min_qty'] = Variable<int>(minQty.value);
    }
    if (price.present) {
      map['price'] = Variable<double>(price.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PriceRuleRowsCompanion(')
          ..write('priceTableId: $priceTableId, ')
          ..write('productId: $productId, ')
          ..write('minQty: $minQty, ')
          ..write('price: $price, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $OrderQueueRowsTable extends OrderQueueRows
    with TableInfo<$OrderQueueRowsTable, OrderQueueRow> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $OrderQueueRowsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _clientUuidMeta =
      const VerificationMeta('clientUuid');
  @override
  late final GeneratedColumn<String> clientUuid = GeneratedColumn<String>(
      'client_uuid', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<int> customerId = GeneratedColumn<int>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _customerNameMeta =
      const VerificationMeta('customerName');
  @override
  late final GeneratedColumn<String> customerName = GeneratedColumn<String>(
      'customer_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _discountPctMeta =
      const VerificationMeta('discountPct');
  @override
  late final GeneratedColumn<double> discountPct = GeneratedColumn<double>(
      'discount_pct', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _noteMeta = const VerificationMeta('note');
  @override
  late final GeneratedColumn<String> note = GeneratedColumn<String>(
      'note', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _itemsJsonMeta =
      const VerificationMeta('itemsJson');
  @override
  late final GeneratedColumn<String> itemsJson = GeneratedColumn<String>(
      'items_json', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _previewTotalMeta =
      const VerificationMeta('previewTotal');
  @override
  late final GeneratedColumn<double> previewTotal = GeneratedColumn<double>(
      'preview_total', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('pending'));
  @override
  List<GeneratedColumn> get $columns => [
        clientUuid,
        customerId,
        customerName,
        discountPct,
        note,
        itemsJson,
        previewTotal,
        status
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'order_queue_rows';
  @override
  VerificationContext validateIntegrity(Insertable<OrderQueueRow> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('client_uuid')) {
      context.handle(
          _clientUuidMeta,
          clientUuid.isAcceptableOrUnknown(
              data['client_uuid']!, _clientUuidMeta));
    } else if (isInserting) {
      context.missing(_clientUuidMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('customer_name')) {
      context.handle(
          _customerNameMeta,
          customerName.isAcceptableOrUnknown(
              data['customer_name']!, _customerNameMeta));
    } else if (isInserting) {
      context.missing(_customerNameMeta);
    }
    if (data.containsKey('discount_pct')) {
      context.handle(
          _discountPctMeta,
          discountPct.isAcceptableOrUnknown(
              data['discount_pct']!, _discountPctMeta));
    }
    if (data.containsKey('note')) {
      context.handle(
          _noteMeta, note.isAcceptableOrUnknown(data['note']!, _noteMeta));
    }
    if (data.containsKey('items_json')) {
      context.handle(_itemsJsonMeta,
          itemsJson.isAcceptableOrUnknown(data['items_json']!, _itemsJsonMeta));
    } else if (isInserting) {
      context.missing(_itemsJsonMeta);
    }
    if (data.containsKey('preview_total')) {
      context.handle(
          _previewTotalMeta,
          previewTotal.isAcceptableOrUnknown(
              data['preview_total']!, _previewTotalMeta));
    } else if (isInserting) {
      context.missing(_previewTotalMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {clientUuid};
  @override
  OrderQueueRow map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return OrderQueueRow(
      clientUuid: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}client_uuid'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}customer_id'])!,
      customerName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_name'])!,
      discountPct: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}discount_pct'])!,
      note: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}note']),
      itemsJson: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}items_json'])!,
      previewTotal: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}preview_total'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
    );
  }

  @override
  $OrderQueueRowsTable createAlias(String alias) {
    return $OrderQueueRowsTable(attachedDatabase, alias);
  }
}

class OrderQueueRow extends DataClass implements Insertable<OrderQueueRow> {
  final String clientUuid;
  final int customerId;
  final String customerName;
  final double discountPct;
  final String? note;
  final String itemsJson;
  final double previewTotal;
  final String status;
  const OrderQueueRow(
      {required this.clientUuid,
      required this.customerId,
      required this.customerName,
      required this.discountPct,
      this.note,
      required this.itemsJson,
      required this.previewTotal,
      required this.status});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['client_uuid'] = Variable<String>(clientUuid);
    map['customer_id'] = Variable<int>(customerId);
    map['customer_name'] = Variable<String>(customerName);
    map['discount_pct'] = Variable<double>(discountPct);
    if (!nullToAbsent || note != null) {
      map['note'] = Variable<String>(note);
    }
    map['items_json'] = Variable<String>(itemsJson);
    map['preview_total'] = Variable<double>(previewTotal);
    map['status'] = Variable<String>(status);
    return map;
  }

  OrderQueueRowsCompanion toCompanion(bool nullToAbsent) {
    return OrderQueueRowsCompanion(
      clientUuid: Value(clientUuid),
      customerId: Value(customerId),
      customerName: Value(customerName),
      discountPct: Value(discountPct),
      note: note == null && nullToAbsent ? const Value.absent() : Value(note),
      itemsJson: Value(itemsJson),
      previewTotal: Value(previewTotal),
      status: Value(status),
    );
  }

  factory OrderQueueRow.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return OrderQueueRow(
      clientUuid: serializer.fromJson<String>(json['clientUuid']),
      customerId: serializer.fromJson<int>(json['customerId']),
      customerName: serializer.fromJson<String>(json['customerName']),
      discountPct: serializer.fromJson<double>(json['discountPct']),
      note: serializer.fromJson<String?>(json['note']),
      itemsJson: serializer.fromJson<String>(json['itemsJson']),
      previewTotal: serializer.fromJson<double>(json['previewTotal']),
      status: serializer.fromJson<String>(json['status']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'clientUuid': serializer.toJson<String>(clientUuid),
      'customerId': serializer.toJson<int>(customerId),
      'customerName': serializer.toJson<String>(customerName),
      'discountPct': serializer.toJson<double>(discountPct),
      'note': serializer.toJson<String?>(note),
      'itemsJson': serializer.toJson<String>(itemsJson),
      'previewTotal': serializer.toJson<double>(previewTotal),
      'status': serializer.toJson<String>(status),
    };
  }

  OrderQueueRow copyWith(
          {String? clientUuid,
          int? customerId,
          String? customerName,
          double? discountPct,
          Value<String?> note = const Value.absent(),
          String? itemsJson,
          double? previewTotal,
          String? status}) =>
      OrderQueueRow(
        clientUuid: clientUuid ?? this.clientUuid,
        customerId: customerId ?? this.customerId,
        customerName: customerName ?? this.customerName,
        discountPct: discountPct ?? this.discountPct,
        note: note.present ? note.value : this.note,
        itemsJson: itemsJson ?? this.itemsJson,
        previewTotal: previewTotal ?? this.previewTotal,
        status: status ?? this.status,
      );
  OrderQueueRow copyWithCompanion(OrderQueueRowsCompanion data) {
    return OrderQueueRow(
      clientUuid:
          data.clientUuid.present ? data.clientUuid.value : this.clientUuid,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      customerName: data.customerName.present
          ? data.customerName.value
          : this.customerName,
      discountPct:
          data.discountPct.present ? data.discountPct.value : this.discountPct,
      note: data.note.present ? data.note.value : this.note,
      itemsJson: data.itemsJson.present ? data.itemsJson.value : this.itemsJson,
      previewTotal: data.previewTotal.present
          ? data.previewTotal.value
          : this.previewTotal,
      status: data.status.present ? data.status.value : this.status,
    );
  }

  @override
  String toString() {
    return (StringBuffer('OrderQueueRow(')
          ..write('clientUuid: $clientUuid, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('discountPct: $discountPct, ')
          ..write('note: $note, ')
          ..write('itemsJson: $itemsJson, ')
          ..write('previewTotal: $previewTotal, ')
          ..write('status: $status')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(clientUuid, customerId, customerName,
      discountPct, note, itemsJson, previewTotal, status);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is OrderQueueRow &&
          other.clientUuid == this.clientUuid &&
          other.customerId == this.customerId &&
          other.customerName == this.customerName &&
          other.discountPct == this.discountPct &&
          other.note == this.note &&
          other.itemsJson == this.itemsJson &&
          other.previewTotal == this.previewTotal &&
          other.status == this.status);
}

class OrderQueueRowsCompanion extends UpdateCompanion<OrderQueueRow> {
  final Value<String> clientUuid;
  final Value<int> customerId;
  final Value<String> customerName;
  final Value<double> discountPct;
  final Value<String?> note;
  final Value<String> itemsJson;
  final Value<double> previewTotal;
  final Value<String> status;
  final Value<int> rowid;
  const OrderQueueRowsCompanion({
    this.clientUuid = const Value.absent(),
    this.customerId = const Value.absent(),
    this.customerName = const Value.absent(),
    this.discountPct = const Value.absent(),
    this.note = const Value.absent(),
    this.itemsJson = const Value.absent(),
    this.previewTotal = const Value.absent(),
    this.status = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  OrderQueueRowsCompanion.insert({
    required String clientUuid,
    required int customerId,
    required String customerName,
    this.discountPct = const Value.absent(),
    this.note = const Value.absent(),
    required String itemsJson,
    required double previewTotal,
    this.status = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : clientUuid = Value(clientUuid),
        customerId = Value(customerId),
        customerName = Value(customerName),
        itemsJson = Value(itemsJson),
        previewTotal = Value(previewTotal);
  static Insertable<OrderQueueRow> custom({
    Expression<String>? clientUuid,
    Expression<int>? customerId,
    Expression<String>? customerName,
    Expression<double>? discountPct,
    Expression<String>? note,
    Expression<String>? itemsJson,
    Expression<double>? previewTotal,
    Expression<String>? status,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (clientUuid != null) 'client_uuid': clientUuid,
      if (customerId != null) 'customer_id': customerId,
      if (customerName != null) 'customer_name': customerName,
      if (discountPct != null) 'discount_pct': discountPct,
      if (note != null) 'note': note,
      if (itemsJson != null) 'items_json': itemsJson,
      if (previewTotal != null) 'preview_total': previewTotal,
      if (status != null) 'status': status,
      if (rowid != null) 'rowid': rowid,
    });
  }

  OrderQueueRowsCompanion copyWith(
      {Value<String>? clientUuid,
      Value<int>? customerId,
      Value<String>? customerName,
      Value<double>? discountPct,
      Value<String?>? note,
      Value<String>? itemsJson,
      Value<double>? previewTotal,
      Value<String>? status,
      Value<int>? rowid}) {
    return OrderQueueRowsCompanion(
      clientUuid: clientUuid ?? this.clientUuid,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      discountPct: discountPct ?? this.discountPct,
      note: note ?? this.note,
      itemsJson: itemsJson ?? this.itemsJson,
      previewTotal: previewTotal ?? this.previewTotal,
      status: status ?? this.status,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (clientUuid.present) {
      map['client_uuid'] = Variable<String>(clientUuid.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<int>(customerId.value);
    }
    if (customerName.present) {
      map['customer_name'] = Variable<String>(customerName.value);
    }
    if (discountPct.present) {
      map['discount_pct'] = Variable<double>(discountPct.value);
    }
    if (note.present) {
      map['note'] = Variable<String>(note.value);
    }
    if (itemsJson.present) {
      map['items_json'] = Variable<String>(itemsJson.value);
    }
    if (previewTotal.present) {
      map['preview_total'] = Variable<double>(previewTotal.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('OrderQueueRowsCompanion(')
          ..write('clientUuid: $clientUuid, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('discountPct: $discountPct, ')
          ..write('note: $note, ')
          ..write('itemsJson: $itemsJson, ')
          ..write('previewTotal: $previewTotal, ')
          ..write('status: $status, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $ProductRowsTable productRows = $ProductRowsTable(this);
  late final $CustomerRowsTable customerRows = $CustomerRowsTable(this);
  late final $PriceRuleRowsTable priceRuleRows = $PriceRuleRowsTable(this);
  late final $OrderQueueRowsTable orderQueueRows = $OrderQueueRowsTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [productRows, customerRows, priceRuleRows, orderQueueRows];
}

typedef $$ProductRowsTableCreateCompanionBuilder = ProductRowsCompanion
    Function({
  Value<int> id,
  required String sku,
  required String name,
  Value<String> unit,
  Value<String?> category,
  required double basePrice,
  Value<int> stock,
});
typedef $$ProductRowsTableUpdateCompanionBuilder = ProductRowsCompanion
    Function({
  Value<int> id,
  Value<String> sku,
  Value<String> name,
  Value<String> unit,
  Value<String?> category,
  Value<double> basePrice,
  Value<int> stock,
});

class $$ProductRowsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $ProductRowsTable> {
  $$ProductRowsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get sku => $state.composableBuilder(
      column: $state.table.sku,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get name => $state.composableBuilder(
      column: $state.table.name,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get unit => $state.composableBuilder(
      column: $state.table.unit,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get category => $state.composableBuilder(
      column: $state.table.category,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get basePrice => $state.composableBuilder(
      column: $state.table.basePrice,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get stock => $state.composableBuilder(
      column: $state.table.stock,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$ProductRowsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $ProductRowsTable> {
  $$ProductRowsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get sku => $state.composableBuilder(
      column: $state.table.sku,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get name => $state.composableBuilder(
      column: $state.table.name,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get unit => $state.composableBuilder(
      column: $state.table.unit,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get category => $state.composableBuilder(
      column: $state.table.category,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get basePrice => $state.composableBuilder(
      column: $state.table.basePrice,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get stock => $state.composableBuilder(
      column: $state.table.stock,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$ProductRowsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ProductRowsTable,
    ProductRow,
    $$ProductRowsTableFilterComposer,
    $$ProductRowsTableOrderingComposer,
    $$ProductRowsTableCreateCompanionBuilder,
    $$ProductRowsTableUpdateCompanionBuilder,
    (ProductRow, BaseReferences<_$AppDatabase, $ProductRowsTable, ProductRow>),
    ProductRow,
    PrefetchHooks Function()> {
  $$ProductRowsTableTableManager(_$AppDatabase db, $ProductRowsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$ProductRowsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$ProductRowsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> sku = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String> unit = const Value.absent(),
            Value<String?> category = const Value.absent(),
            Value<double> basePrice = const Value.absent(),
            Value<int> stock = const Value.absent(),
          }) =>
              ProductRowsCompanion(
            id: id,
            sku: sku,
            name: name,
            unit: unit,
            category: category,
            basePrice: basePrice,
            stock: stock,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String sku,
            required String name,
            Value<String> unit = const Value.absent(),
            Value<String?> category = const Value.absent(),
            required double basePrice,
            Value<int> stock = const Value.absent(),
          }) =>
              ProductRowsCompanion.insert(
            id: id,
            sku: sku,
            name: name,
            unit: unit,
            category: category,
            basePrice: basePrice,
            stock: stock,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ProductRowsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ProductRowsTable,
    ProductRow,
    $$ProductRowsTableFilterComposer,
    $$ProductRowsTableOrderingComposer,
    $$ProductRowsTableCreateCompanionBuilder,
    $$ProductRowsTableUpdateCompanionBuilder,
    (ProductRow, BaseReferences<_$AppDatabase, $ProductRowsTable, ProductRow>),
    ProductRow,
    PrefetchHooks Function()>;
typedef $$CustomerRowsTableCreateCompanionBuilder = CustomerRowsCompanion
    Function({
  Value<int> id,
  required String name,
  Value<String?> city,
  Value<int?> priceTableId,
  Value<double> creditLimit,
});
typedef $$CustomerRowsTableUpdateCompanionBuilder = CustomerRowsCompanion
    Function({
  Value<int> id,
  Value<String> name,
  Value<String?> city,
  Value<int?> priceTableId,
  Value<double> creditLimit,
});

class $$CustomerRowsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $CustomerRowsTable> {
  $$CustomerRowsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get name => $state.composableBuilder(
      column: $state.table.name,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get city => $state.composableBuilder(
      column: $state.table.city,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get priceTableId => $state.composableBuilder(
      column: $state.table.priceTableId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get creditLimit => $state.composableBuilder(
      column: $state.table.creditLimit,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$CustomerRowsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $CustomerRowsTable> {
  $$CustomerRowsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get name => $state.composableBuilder(
      column: $state.table.name,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get city => $state.composableBuilder(
      column: $state.table.city,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get priceTableId => $state.composableBuilder(
      column: $state.table.priceTableId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get creditLimit => $state.composableBuilder(
      column: $state.table.creditLimit,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$CustomerRowsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CustomerRowsTable,
    CustomerRow,
    $$CustomerRowsTableFilterComposer,
    $$CustomerRowsTableOrderingComposer,
    $$CustomerRowsTableCreateCompanionBuilder,
    $$CustomerRowsTableUpdateCompanionBuilder,
    (
      CustomerRow,
      BaseReferences<_$AppDatabase, $CustomerRowsTable, CustomerRow>
    ),
    CustomerRow,
    PrefetchHooks Function()> {
  $$CustomerRowsTableTableManager(_$AppDatabase db, $CustomerRowsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$CustomerRowsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$CustomerRowsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String?> city = const Value.absent(),
            Value<int?> priceTableId = const Value.absent(),
            Value<double> creditLimit = const Value.absent(),
          }) =>
              CustomerRowsCompanion(
            id: id,
            name: name,
            city: city,
            priceTableId: priceTableId,
            creditLimit: creditLimit,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String name,
            Value<String?> city = const Value.absent(),
            Value<int?> priceTableId = const Value.absent(),
            Value<double> creditLimit = const Value.absent(),
          }) =>
              CustomerRowsCompanion.insert(
            id: id,
            name: name,
            city: city,
            priceTableId: priceTableId,
            creditLimit: creditLimit,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CustomerRowsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CustomerRowsTable,
    CustomerRow,
    $$CustomerRowsTableFilterComposer,
    $$CustomerRowsTableOrderingComposer,
    $$CustomerRowsTableCreateCompanionBuilder,
    $$CustomerRowsTableUpdateCompanionBuilder,
    (
      CustomerRow,
      BaseReferences<_$AppDatabase, $CustomerRowsTable, CustomerRow>
    ),
    CustomerRow,
    PrefetchHooks Function()>;
typedef $$PriceRuleRowsTableCreateCompanionBuilder = PriceRuleRowsCompanion
    Function({
  required int priceTableId,
  required int productId,
  Value<int> minQty,
  required double price,
  Value<int> rowid,
});
typedef $$PriceRuleRowsTableUpdateCompanionBuilder = PriceRuleRowsCompanion
    Function({
  Value<int> priceTableId,
  Value<int> productId,
  Value<int> minQty,
  Value<double> price,
  Value<int> rowid,
});

class $$PriceRuleRowsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $PriceRuleRowsTable> {
  $$PriceRuleRowsTableFilterComposer(super.$state);
  ColumnFilters<int> get priceTableId => $state.composableBuilder(
      column: $state.table.priceTableId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get productId => $state.composableBuilder(
      column: $state.table.productId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get minQty => $state.composableBuilder(
      column: $state.table.minQty,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get price => $state.composableBuilder(
      column: $state.table.price,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$PriceRuleRowsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $PriceRuleRowsTable> {
  $$PriceRuleRowsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get priceTableId => $state.composableBuilder(
      column: $state.table.priceTableId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get productId => $state.composableBuilder(
      column: $state.table.productId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get minQty => $state.composableBuilder(
      column: $state.table.minQty,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get price => $state.composableBuilder(
      column: $state.table.price,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$PriceRuleRowsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $PriceRuleRowsTable,
    PriceRuleRow,
    $$PriceRuleRowsTableFilterComposer,
    $$PriceRuleRowsTableOrderingComposer,
    $$PriceRuleRowsTableCreateCompanionBuilder,
    $$PriceRuleRowsTableUpdateCompanionBuilder,
    (
      PriceRuleRow,
      BaseReferences<_$AppDatabase, $PriceRuleRowsTable, PriceRuleRow>
    ),
    PriceRuleRow,
    PrefetchHooks Function()> {
  $$PriceRuleRowsTableTableManager(_$AppDatabase db, $PriceRuleRowsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$PriceRuleRowsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$PriceRuleRowsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> priceTableId = const Value.absent(),
            Value<int> productId = const Value.absent(),
            Value<int> minQty = const Value.absent(),
            Value<double> price = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              PriceRuleRowsCompanion(
            priceTableId: priceTableId,
            productId: productId,
            minQty: minQty,
            price: price,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required int priceTableId,
            required int productId,
            Value<int> minQty = const Value.absent(),
            required double price,
            Value<int> rowid = const Value.absent(),
          }) =>
              PriceRuleRowsCompanion.insert(
            priceTableId: priceTableId,
            productId: productId,
            minQty: minQty,
            price: price,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$PriceRuleRowsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $PriceRuleRowsTable,
    PriceRuleRow,
    $$PriceRuleRowsTableFilterComposer,
    $$PriceRuleRowsTableOrderingComposer,
    $$PriceRuleRowsTableCreateCompanionBuilder,
    $$PriceRuleRowsTableUpdateCompanionBuilder,
    (
      PriceRuleRow,
      BaseReferences<_$AppDatabase, $PriceRuleRowsTable, PriceRuleRow>
    ),
    PriceRuleRow,
    PrefetchHooks Function()>;
typedef $$OrderQueueRowsTableCreateCompanionBuilder = OrderQueueRowsCompanion
    Function({
  required String clientUuid,
  required int customerId,
  required String customerName,
  Value<double> discountPct,
  Value<String?> note,
  required String itemsJson,
  required double previewTotal,
  Value<String> status,
  Value<int> rowid,
});
typedef $$OrderQueueRowsTableUpdateCompanionBuilder = OrderQueueRowsCompanion
    Function({
  Value<String> clientUuid,
  Value<int> customerId,
  Value<String> customerName,
  Value<double> discountPct,
  Value<String?> note,
  Value<String> itemsJson,
  Value<double> previewTotal,
  Value<String> status,
  Value<int> rowid,
});

class $$OrderQueueRowsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $OrderQueueRowsTable> {
  $$OrderQueueRowsTableFilterComposer(super.$state);
  ColumnFilters<String> get clientUuid => $state.composableBuilder(
      column: $state.table.clientUuid,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get customerId => $state.composableBuilder(
      column: $state.table.customerId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get customerName => $state.composableBuilder(
      column: $state.table.customerName,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get discountPct => $state.composableBuilder(
      column: $state.table.discountPct,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get note => $state.composableBuilder(
      column: $state.table.note,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get itemsJson => $state.composableBuilder(
      column: $state.table.itemsJson,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get previewTotal => $state.composableBuilder(
      column: $state.table.previewTotal,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get status => $state.composableBuilder(
      column: $state.table.status,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$OrderQueueRowsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $OrderQueueRowsTable> {
  $$OrderQueueRowsTableOrderingComposer(super.$state);
  ColumnOrderings<String> get clientUuid => $state.composableBuilder(
      column: $state.table.clientUuid,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get customerId => $state.composableBuilder(
      column: $state.table.customerId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get customerName => $state.composableBuilder(
      column: $state.table.customerName,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get discountPct => $state.composableBuilder(
      column: $state.table.discountPct,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get note => $state.composableBuilder(
      column: $state.table.note,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get itemsJson => $state.composableBuilder(
      column: $state.table.itemsJson,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get previewTotal => $state.composableBuilder(
      column: $state.table.previewTotal,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get status => $state.composableBuilder(
      column: $state.table.status,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$OrderQueueRowsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $OrderQueueRowsTable,
    OrderQueueRow,
    $$OrderQueueRowsTableFilterComposer,
    $$OrderQueueRowsTableOrderingComposer,
    $$OrderQueueRowsTableCreateCompanionBuilder,
    $$OrderQueueRowsTableUpdateCompanionBuilder,
    (
      OrderQueueRow,
      BaseReferences<_$AppDatabase, $OrderQueueRowsTable, OrderQueueRow>
    ),
    OrderQueueRow,
    PrefetchHooks Function()> {
  $$OrderQueueRowsTableTableManager(
      _$AppDatabase db, $OrderQueueRowsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$OrderQueueRowsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$OrderQueueRowsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<String> clientUuid = const Value.absent(),
            Value<int> customerId = const Value.absent(),
            Value<String> customerName = const Value.absent(),
            Value<double> discountPct = const Value.absent(),
            Value<String?> note = const Value.absent(),
            Value<String> itemsJson = const Value.absent(),
            Value<double> previewTotal = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              OrderQueueRowsCompanion(
            clientUuid: clientUuid,
            customerId: customerId,
            customerName: customerName,
            discountPct: discountPct,
            note: note,
            itemsJson: itemsJson,
            previewTotal: previewTotal,
            status: status,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String clientUuid,
            required int customerId,
            required String customerName,
            Value<double> discountPct = const Value.absent(),
            Value<String?> note = const Value.absent(),
            required String itemsJson,
            required double previewTotal,
            Value<String> status = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              OrderQueueRowsCompanion.insert(
            clientUuid: clientUuid,
            customerId: customerId,
            customerName: customerName,
            discountPct: discountPct,
            note: note,
            itemsJson: itemsJson,
            previewTotal: previewTotal,
            status: status,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$OrderQueueRowsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $OrderQueueRowsTable,
    OrderQueueRow,
    $$OrderQueueRowsTableFilterComposer,
    $$OrderQueueRowsTableOrderingComposer,
    $$OrderQueueRowsTableCreateCompanionBuilder,
    $$OrderQueueRowsTableUpdateCompanionBuilder,
    (
      OrderQueueRow,
      BaseReferences<_$AppDatabase, $OrderQueueRowsTable, OrderQueueRow>
    ),
    OrderQueueRow,
    PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$ProductRowsTableTableManager get productRows =>
      $$ProductRowsTableTableManager(_db, _db.productRows);
  $$CustomerRowsTableTableManager get customerRows =>
      $$CustomerRowsTableTableManager(_db, _db.customerRows);
  $$PriceRuleRowsTableTableManager get priceRuleRows =>
      $$PriceRuleRowsTableTableManager(_db, _db.priceRuleRows);
  $$OrderQueueRowsTableTableManager get orderQueueRows =>
      $$OrderQueueRowsTableTableManager(_db, _db.orderQueueRows);
}
